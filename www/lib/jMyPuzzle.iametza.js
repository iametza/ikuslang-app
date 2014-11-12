/* 
 * 
 * Copyright (c) 2007 e-nova technologies pvt. ltd. (kevin.muller@enova-tech.net || http://www.enova-tech.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *            __             ___      ___    __  __     __     
 *          /'__`\    __   /' _ `\   / __`\ /\ \/\ \  /'__`\   
 *         /\  __/  /\__\  /\ \/\ \ /\ \_\ \\ \ \_/ |/\ \_\.\_ 
 *  (o_    \ \____\ \/__/  \ \_\ \_\\ \____/ \ \___/ \ \__/.\_\    _o)
 *  (/)_    \/____/         \/_/\/_/ \/___/   \/__/   \/__/\/_/   _(\)
 *       
 *           L'ère du stup !  
 *  
 *
 * $LastChangedDate: 2007-01-04 18:10:42 -0500 (Fri, 04 Jan 2007) $
 * $Rev: 08 $
 *
 * Version: 0.1
 * 
 * Modified by Asier Iturralde Sarasola
 * iametza interaktiboa (http://www.iametza.com/)
 */

(function ( $ ) {                 			    // Compliant with jquery.noConflict()
$.fn.jMyPuzzle = function(o) {  
	o = $.extend({
		phrase: ["To", "be", "or", "not", "to", "be,", "that is", "the", "question!"],
		answers: [[0, 1, 2, 3, 4, 5, 6, 7, 8]],	// right answer's order
        
		language: 'eu',							// the language of the user interface
		
        maxTrials:3,							// maximum number of trials, 0 for unlimited
        showTrials:true,                        // Whether to show the number of trials or not
        classOnValid:'valid',					// class to apply to the element when valid
        classOnNotValid:'notValid',				// class to apply to the element when not valid
        classOnMiValid:'miValid',				// class to apply to the element when mi valid
        
        fnOnCheck:null,							// To call its custom callback function at the end of the check. The function will be provided with the results variables of the exercise.
        										// example : function(jSonResults){ alert("Your success rate : " + jSonResults.success_rate + "%") }
        										
        ajaxResultUrl:'',						// Ajax url where to send the results. The results will be sent by post with the following variables :
        										// nb_words : The total number of words
        										// nb_valid : The number of valid elements (where the user is right)
        										// nb_not_valid : The number of non valid elements (where the user is not right)
        										// nb_mi_valid : The number of mi valid elements (at least 3 consecutive right elements, but not at the right place)
        										// success_rate : The success rate for the trial
        										// trial_nb : The trial number
        										// max_trials : The maximum number of trials allowed 
        										// answer : The answer given by the user
        										
		fnOnAjax:null,							// custom function to call at the end of the ajax treatment. enables to get the data sent back from the server : example function(data){ alert(data); }
        fnOnReset:null,
        //private datas
        
        elts: new Array()
    }, o || {});

	var i18n = {
			en: {
				'textCheckButton': 'check',
				'textResetButton': 'reset'
			},
			eu: {
				'textCheckButton': 'zuzendu',
				'textResetButton': 'berrezarri'
			},
			es: {
				'textCheckButton': 'comprobar',
				'textResetButton': 'restablecer'
			}
	};
	
	return this.each(function() {
		// Create the p element to show the current/total number of trials and append it to the container div
        if (o.showTrials) {
            $(this).append("<p id='trials'></p>");
        }
		
		// Create the ul element to contain the parts of the phrase and append it to the container div
		$(this).append("<ul id='parts'></ul>");
		
		// Create the reset button and append it to the container div
		$(this).append('<input type="button" class="button" id="reset" value="' + i18n[o.language].textResetButton + '" />');
		
		// Create the check button and append it to the container div
		$(this).append('<input type="button" class="button" id="check" value="' + i18n[o.language].textCheckButton + '" />');
		
		// Create an unordered array with as much elements as words are in the phrase
		var unordered = [];
		for (var i = 0; i < o.phrase.length; i++) {
			unordered.push(i);
		}
		unordered = unordered.sort(function() {return 0.5 - Math.random();});
		
		// Create an array for the correct answers
		var correct_answers = [];
		
		// Add as much arrays as correct answers are to the correct_answers array
		for (var i = 0; i < o.answers.length; i++) {
			correct_answers.push([]);
		}
		
		// Create the li element for each part of the phrase and save the correct answers in the correct_answers array
		for (var i = 0; i < o.phrase.length; i++) {
			// Append the li of the current part to the ul
			$("#parts").append("<li>" + o.phrase[unordered[i]] + "</li>");
			
			// For each possible correct answer order
			for (var j = 0; j < o.answers.length; j++) {
				// For each part in the current correct answer order
				for (var k = 0; k < o.answers[j].length; k++) {
					// If current part is equal to the part in the li that we just created
					if (o.answers[j][k] == unordered[i]) {
						correct_answers[j][k] = i + 1;	// Save the correct position
					}
				}
			}
		}
		
		var div = $(this), ul = $("ul", div), li = $("li", ul);		// Variables declaration
		
		// Check if the number of elements of each correct answer and the number of li-s are equal
		for (var i = 0; i < correct_answers.length; i++) {
			if(correct_answers[i].length != li.size()) {
				alert("error - answer doesn't match !");
			}
		}
		
		var left=0, move=null, forward = 1, backward=2, eltPos = 0;		
		this.elts = new Array(li.size());
		var elts = this.elts, n = 0, ulSize = 0, nbTrials = 0, nbValid=0, nbNotValid=0, nbMiValid=0;						

		
		ul.css({display:'block', position:'absolute'});				// ul style
		li.css({													// li style
				'float':'left',
				"list-style-type":"none",
				'display':'block',
				'position':'absolute'
				});
		
		if(o.showTrials && o.maxTrials > 0 && $('#trials').length){					// initial filling of the trial layer 
			$('#trials').html(0 + '/' + o.maxTrials);
		}
		

		li.each(function(){ ulSize += width($(this)); });			// calculate the size of the ul element

		//div.css('width', ulSize);									// set the div size
		ul.css({width:ulSize, height: ((li.height() + parseInt(li.css('marginTop')) + parseInt(li.css('marginBottom')) + parseInt(li.css('paddingBottom')) * 2 + parseInt(li.css('paddingTop')) * 2) + 'px') });	 	// Update the ul size
		
		// Kode zaharra ez zen ondo konpontzen Bootstrapekin eta ul-a ez zen kaxaren erdian agertzen, col-md-12-ren position relative delako.
		// Ikusi hau: http://stackoverflow.com/questions/3202008/jquery-difference-between-position-and-offset
		//ul.css('left', div.offset().left + ((div.width() - ulSize) / 2)); // Center the ul in the main div
		ul.css('left', div.position().left + ((div.width() - ulSize) / 2)); // Center the ul in the main div
		
		initPos();													// init the li position (left position) 
		
		li.each(function(){ 
			var elt = $(this);										// current element														
																	// collect information about the element and store them into the object itself
			elt.outerWidth = width($(this));						// its size (with the margin)
			elt.pos = getOffset(elt);								// its position (left and top position)
			elt.initialN = n;										// its initial position (as per the other elements)
			elt.n = n;												// its current position (as per the other elements)

			elt.draggable({											// make the element draggable
				containment: div,
				drag: function(evt, ui){ onDrag(evt, ui, elt, elts); }, // event on drag
				start: function(evt, ui){								// even on start dragging
					var e = elts[elt.n];
				 	e.css({'opacity': 0.4, 'z-index':200});
				},
				stop:function(evt, ui){								// event on stop dragging
				 	var e = elts[elt.n];
				 	e.css({'opacity': 1.0, 'z-index':5});
				 	e.animate({left: e.pos.left, top : e.pos.top}, 300);
				}
			});
			
			elts[n++] = elt;
		});
		
		if($('#check').length){										// if the 'check' button exists
			$('#check').click(function(){							// on check event
				nbValid=0;											// Number of valid answers
				nbNotValid=0;										// Number of invalid answers
				nbMiValid=0;										// Number of mi valid answers ????
				
				if(o.maxTrials > 0){								// set the trials counter and display update
					if(nbTrials >= o.maxTrials){ return; }			// If the number of trials is bigger than the max number of trials return
					nbTrials++;										// Add one to the number of trials
                    
                    if (o.showTrials) {
                        $('#trials').html(nbTrials + '/' + o.maxTrials);// Display the new number of trials / max number of trials
                    }
				}
				
				return show(0, check(correct_answers));							// call the check function and show the results.
			});
		}
		if($('#reset').length){
			$('#reset').click(function(){							// on reset event
				var nbElts = li.size();
				var eltN = 0;
				for(var i = 0; i < nbElts; i++){
					if(elts[i].initialN != i){						// if something is wrong in the order
						for(var j = i; j < nbElts; j++){						// look for the missing piece
							if(elts[j].initialN == i){				// if we found the missing piece
								var wrongPiece = elts[i];
								elts[i] = elts[j];
								elts[i].n = i;
								elts[i].insertBefore(elts[i+1]);
								elts[j] = wrongPiece;
								elts[j].n = j;
								if(j+1 < nbElts){
									elts[j].insertBefore(elts[j+1]);
								}
								else{
									elts[j].insertAfter(elts[j-1]);
								}
								break;
							}
						}
					}
				}
				initPos();											// reinit everything. All the positions are messed up due to the reorganization
				for(var i = 0; i < nbElts; i++){
					elts[i].pos = getOffset(elts[i]);
				}
				o.fnOnReset();
			});
		}
		
		/*
		 * check the elements one by one to know whether it's position is correct.
		 * 
		 * @param answerTab: the given answer array
		 * 
		 * Returns an array that shows the correctness of each position.
		 * The possible values are:
		 * 2: correct
		 * 1: partially correct 
		 * 0: incorrect:
		 */
		function check(answerTab) {
			var everythingCorrect = true;
			var wordCorrectness = [];
			
			// Check if each word is correct in any of the correct answers
			for (var i = 0; i < answerTab.length; i++) {
				everythingCorrect = true; // Reset the control variable
				for (var j = 0; j < answerTab[i].length; j++) {
					if(elts[j].initialN + 1 == answerTab[i][j]){
						wordCorrectness[j] = 2;
					} else {
						everythingCorrect = false;
					}
				}
				if (everythingCorrect) {
					return wordCorrectness;
				}
			}
			
			// The answer is not completely correct.
			// We will return an array that shows the correctness of each word
			var correctnessCount = 0;
			for (var i = 0; i < answerTab[0].length; i++) {
				correctnessCount = 0;
				for (var j = 0; j < answerTab.length; j++) {
					if (elts[i].initialN + 1 == answerTab[j][i]) {
						correctnessCount = correctnessCount + 1;
					}
				}
				
				if (correctnessCount == answerTab.length) {
					wordCorrectness[i] = 2;
				} else if (correctnessCount > 0) {
					wordCorrectness[i] = 1;
				} else {
					wordCorrectness[i] = 0;
				}
			}
			return wordCorrectness;
		}
		
		/**
		 * recursive function that shows the correctness of each word. 
		 * @param n: the round
		 * @param wordCorrectness: an array that shows the correctness of each position
		 */
		function show(n, wordCorrectness){
			if(n >= wordCorrectness.length){									// LAST ROUND : everything has been checked. finalization
				var nbWords = wordCorrectness.length;
				var successPercent = ((nbValid  * 1 + nbMiValid * 0.5) / nbWords) * 100;
				var trialNb = nbTrials;
				var answer = '';
				for(var i = 0; i < nbWords; i++)	{								// Put all the elements at the right place
					answer += ((elts[i].initialN + 1) + ",");
				}
				answer = answer.replace(/,+$/, "");
				
				jSonResults = {											// build the JSON result object
					 nb_words		:nbWords,
					 nb_valid		:nbValid,
					 nb_not_valid	:nbNotValid,
					 nb_mi_valid	:nbMiValid,
					 success_rate	:successPercent,
					 trial_nb		:trialNb,
					 max_trials		:o.maxTrials,
					 answer			:answer	
				};
				
				if(o.fnOnCheck !== null){								// call the function onCheck in case it is set in the params
					return o.fnOnCheck(jSonResults);
				}
				
				if(o.ajaxResultUrl !== ''){								// Send the results through ajax
					$.post(o.ajaxResultUrl, jSonResults, 
					function(data){
						if(o.fnOnAjax !== null){
							o.fnOnAjax(data);
						}
					});
				}
				return;
			}
			
			elts[n].removeClass(o.classOnValid + ' ' + o.classOnMiValid + ' ' + o.classOnNotValid);			// remove all previous classes that can interfer
			var posTop = parseInt(elts[n].pos.top);
			
			return elts[n].animate({'top': (posTop +7) + "px"}, {duration:75, complete:function(){ 			// animation according the the veracity of the element
					if (wordCorrectness[n] == 2) {
						elts[n].addClass(o.classOnValid);
						nbValid++;
					} else if (wordCorrectness[n] == 1) {
						elts[n].addClass(o.classOnMiValid);
						nbMiValid++;
					} else {
						elts[n].addClass(o.classOnNotValid);
						nbNotValid++;
					}
				}
			}).animate({'top': posTop + "px"}, {duration:100, complete:function(){
					return show(n+1, wordCorrectness);
				}
			});
			
			
		}
		
		function onDrag(e, ui, elt, elts){
			var oldPos = (this.eltPos !== null ? this.eltPos : getOffset(elt));
			this.eltPos = getOffset(elt);
			if(this.eltPos.left == oldPos.left) { return; }							// Not moving = doing nothing
			move = (this.eltPos.left > oldPos.left ? forward : backward);			// check whether the move is forward or backward

			if(move == forward){
				if(elt.n < elts.length-1){
					var eltNext = elts[elt.n + 1];
					var eltNextBound = eltNext.pos.left + parseInt(eltNext.outerWidth / 2);
					if(this.eltPos.left + elt.outerWidth > eltNextBound){
						elt.insertAfter(eltNext);
						eltNext.pos.left = elt.pos.left;
						elt.pos.left += eltNext.outerWidth;
						
																					//invert datas in the correspondence array
						elts[elt.n] = eltNext;
						elts[elt.n + 1] = elt;
																					//update the n of the elements
						elts[elt.n].n = elt.n; 
						elt.n = elt.n + 1;
						eltNext.animate({'left': eltNext.pos.left + 'px'}, 300);
					}
				}
			}
			else if(move == backward){
				if(elt.n > 0){
					var eltPrev = elts[elt.n - 1];
					var eltPrevBound = eltPrev.pos.left + parseInt(eltPrev.outerWidth / 2);
					
					if(this.eltPos.left < eltPrevBound){
						elt.insertBefore(eltPrev);
						
						elt.pos.left = eltPrev.pos.left;
						eltPrev.pos.left += elt.outerWidth;
						
																					// invert datas in the array
						elts[elt.n] = eltPrev;
						elts[elt.n - 1] = elt;
																					// update the n of the elements
						elts[elt.n].n = elt.n; 
						elt.n = elt.n - 1;
						
						eltPrev.animate({'left': eltPrev.pos.left + 'px'}, 300);
					}
				}
			}
		}
		
		/*
		 * modified offset function to handle the local position
		 * @param elt: the jquery element
		 */
		function getOffset(elt){												
			return {left : parseInt(elt.css('left')), top : elt.css('top') == 'auto' ? 0 : parseInt(elt.css('top'))};
		}
		/**
		 * init the positions of the li elements as well as their styles
		 */
		function initPos(){
			left=0;													// the first element will be put inside the main div
			li.each(function(){ 									// put all the elements at the right place
				$(this).css('left', left + 'px');
				left += width($(this));
				$(this).removeClass(o.classOnValid + ' ' + o.classOnMiValid + ' ' + o.classOnNotValid);
				$(this).addClass('normal');
			});
		}
	});
};


function css(el, prop) {
    return parseInt($.css(el[0], prop)) || 0;
}

function width(el) {
    	return el[0].offsetWidth + css(el, 'marginLeft') + css(el, 'marginRight');
}

function debug(str){
	$('.debug').html($('.debug').html() + str + "<br/>");
}

})(jQuery);

/****
 *
 * helper
 * *
 * */
function randomFromInterval(from,to)
{
    return Math.floor(Math.random()*(to-from+1)+from);
}

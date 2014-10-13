function Galderak(ezarpenak) {
    
    var ezarpen_lehenetsiak = {
		galderak_desordenatu: true
	};
    
    // erabiltzaileak definitutako ezarpenak hedatu balio lehenetsiekin
	ezarpenak = $.extend(ezarpen_lehenetsiak, ezarpenak);
    
    this.galderak_desordenatu = ezarpenak.galderak_desordenatu;
    
	// Objektu bakoitzak izango dituen berezko propietateak
	this.erantzunak_gaituta; // Erabiltzaileak erantzun dezakeen ala ez (true ala false)
	this.galderak = {}; // Galdera objektuak
	this.id_erantzunak = []; // Uneko galderaren erantzunen id-ak biltzen dituen arraya (agertuko diren ordenean desordenatuta)
	this.id_galderak = []; // Galderen id-ak biltzen dituen arraya (agertuko diren ordenean desordenatuta)
	this.erantzun_oker_kopurua; // Erabiltzaile bat baino gehiago baleude array bat erabili?
	this.erantzun_zuzen_kopurua; // Erabiltzaile bat baino gehiago baleude array bat erabili?
	this.zenbagarren_galdera; // Uneko galdera zenbagarrena den (id_galderak arrayko indizea != galderaren id_galdera)
}

// Objektu guztiek konpartituko dituzten metodoak
Galderak.prototype = {
	// Erabiltzaileari erantzuteko aukera kentzen dio.
	// erantzunak_gaituta == false bada erantzunek ez dute funtzionatzen
	desgaitu_erantzunak: function() {
		this.erantzunak_gaituta = false;
	},
	
	// Erantzun_oker_kopurua gehi bat, erantzun_zuzenak_gehi_bat ere badago
	erantzun_okerrak_gehi_bat: function() {
		this.erantzun_oker_kopurua++;
	},
	
	// Uneko galderaren id_erantzuna duen erantzuna zuzena den ala ez itzultzen du.
	erantzun_zuzena_da: function(id_erantzuna) {
		return this.galderak[this.id_galderak[this.zenbagarren_galdera]].erantzunak[id_erantzuna].zuzena_da;
	},

	// Erantzun_zuzen_kopurua gehi bat, erantzun_okerrak_gehi_bat ere badago
	erantzun_zuzenak_gehi_bat: function() {
		this.erantzun_zuzen_kopurua++;
	},
	
	// Uneko galderaren erantzunen id_erantzuna-k id_erantzunak arrayan sartu eta desordenatu,
	// erantzunak beti ordena berean agertzea saihesteko.
	erantzunak_desordenatu: function() {
		this.id_erantzunak = [];
		for (var id_erantzuna in this.galderak[this.id_galderak[this.zenbagarren_galdera]].erantzunak) {
			this.id_erantzunak.push(id_erantzuna);
		}
		
		// Maparen erantzunak ez dago desordenatu beharrik
		if (this.itzuli_erantzun_mota() != "mapa") {
			this.id_erantzunak.sort(function() {return 0.5 - Math.random()});
		}
	},
	
	// Uneko galdera erantzunanitza den ala ez itzultzen du
	erantzunanitza_da: function() {
		return this.galderak[this.id_galderak[this.zenbagarren_galdera]].erantzunanitza;
	},
	
	// Erabiltzaileari erantzuteko aukera ematen dio.
	// erantzunak_gaituta == false bada erantzunek ez dute funtzionatzen
	gaitu_erantzunak: function() {
		this.erantzunak_gaituta = true;
	},
	
	// Gehitu erantzun bat id_galdera id-a duen galderari
	gehitu_erantzuna: function(id_galdera, id_erantzuna, testua, zuzena_da, id_erantzuna_db) {
		this.galderak[id_galdera].gehitu_erantzuna(id_erantzuna, testua, zuzena_da, id_erantzuna_db);
	},
	
	// Gehitu galdera bat
	gehitu_galdera: function(balioak) {
        
		this.galderak[balioak.id_galdera] = new Galdera(balioak.id_galdera,
                                                        balioak.testua,
                                                        balioak.mota,
                                                        balioak.erantzunanitza,
                                                        balioak.erantzun_mota,
                                                        balioak.fitxategia,
                                                        balioak.noiz);
        
	},
	
	// Galdera sorta bat hasteko prestatu
	hasieratu: function() {
		// Aldagaiak zerora berrezarri
		this.zenbagarren_galdera = 0;
		this.erantzun_zuzen_kopurua = 0;
		this.erantzun_oker_kopurua = 0;
		
		// Galderen id_galdera-k id_galderak arrayan gorde
		this.id_galderak = [];
		
		/* <rant>
		 * Begizta honek arazoak ematen zizkidan Internet Explorer <= 8.
		 * Zorionez jQuery-ko each erabiliz konpondu dut arazoa.
		 * 
		 * Internet Explorer 8 madarikatu hori 2009koa da
		 * eta for...in begiztak Javascript 1.0tik (1996!!!!)
		 * erabiltzen dira. Lotsarik ez Microsoft!!!!
		 * </rant>
		 * 
		 * for (galdera in this.galderak) {
		 *	this.id_galderak.push(galdera)
		}*/
		
		var that = this;
		
		$.each(this.galderak, function(index, value) { 
			that.id_galderak.push(index);
		});
        
        if (this.galderak_desordenatu) {
            
            // Galderen id_galdera-k dituen arraya desordenatu,
            // galderak beti ordena berean agertzea saihesteko.
            this.id_galderak.sort(function() {
                
                return 0.5 - Math.random();
                
            });
            
        }
		
		// Lehenengo galderari dagozkion erantzunak desordenatu
		this.erantzunak_desordenatu();
        
	},
	
	// Galdera sortako hurrengo galderara pasatu.
	// Galderak bukatu badira false itzultzen du.
	hurrengo_galdera: function() {
		this.zenbagarren_galdera++;
		
		if (this.zenbagarren_galdera < this.itzuli_galdera_kopurua()) {
			// Hurrengo galderaren id_erantzunak arraya prestatu:
			// erantzunen id-ak id_erantzunak arrayan gorde 
			// eta desordenatu
			this.erantzunak_desordenatu();
			return true;
		} else {
			return false;
		}
	},
	
	// Uneko galderaren erantzun kopurua itzultzen du
	itzuli_erantzun_kopurua: function() {
		var kop = 0;
		for (var erantzuna in this.galderak[this.id_galderak[this.zenbagarren_galdera]].erantzunak) {
			kop++;
		}
		return kop;
	},
	
	// Uneko galderaren erantzunen mota (testua, irudia, mapa) itzultzen du
	itzuli_erantzun_mota: function() {
		return this.galderak[this.id_galderak[this.zenbagarren_galdera]].erantzun_mota;
	},
	
	// Oker erantzundako galdera kopurua itzultzen du
	itzuli_erantzun_oker_kopurua: function() {
		return this.erantzun_oker_kopurua;
	},
	
	// Zuzen erantzundako galdera kopurua itzultzen du
	itzuli_erantzun_zuzen_kopurua: function() {
		return this.erantzun_zuzen_kopurua;
	},
	
	// Uneko galderaren erantzun zuzenaren id_erantzunak arrayko indizea(k) itzultzen d(it)u (!= erantzun zuzenaren id_erantzuna)
	itzuli_erantzun_zuzenak: function() {
		// Erantzun zuzen bat baino gehiago badaude array bat erabili
		var zuzenak = [];
		for (var i = 0; i < this.id_erantzunak.length; i++) {
			if (this.galderak[this.id_galderak[this.zenbagarren_galdera]].erantzunak[this.id_erantzunak[i]].zuzena_da) {
				zuzenak.push(i);
			}
		}
		return zuzenak;
	},
	
	// Erabiltzaileak erantzun dezakeen ala ez itzultzen du (true ala false)
	itzuli_erantzunak_gaituta: function() {
		return this.erantzunak_gaituta;
	},
	
	// id_erantzuna duen uneko galderaren erantzunaren testua itzultzen du
	itzuli_erantzunaren_testua: function(id_erantzuna) {
		return this.galderak[this.id_galderak[this.zenbagarren_galdera]].erantzunak[id_erantzuna].testua;
	},
	
	// Uneko galderari dagokion fitxategia itzultzen du. Galdera motaren arabera:
	// 	testua: undefined
	//	irudia: irudiaren URLa
	//  soinua: soinuaren SoundManagerreko IDa
	itzuli_fitxategia: function() {
		return this.galderak[this.id_galderak[this.zenbagarren_galdera]].fitxategia;
	},
	
	// Uneko galdera sortaren galdera kopurua itzultzen du
	itzuli_galdera_kopurua: function() {
		return this.id_galderak.length;
	},
	
	// Uneko galderaren id_erantzunak arraya itzultzen du
	itzuli_id_erantzunak: function() {
		return this.id_erantzunak;
	},
	
    // id_galdera galderaren id_erantzuna erantzunaren datu-baseko id-a itzultzen du.
    itzuli_id_erantzuna_db: function(id_galdera, id_erantzuna) {
        return this.galderak[id_galdera].erantzunak[id_erantzuna].id_erantzuna_db;
    },
    
	// Uneko galderaren id_galdera itzultzen du
	itzuli_id_galdera: function() {
		return this.id_galderak[this.zenbagarren_galdera];
	},
	
	//Uneko galderaren galdera-mota itzultzen du: testua, irudia ala soinua
	itzuli_mota: function() {
		return this.galderak[this.id_galderak[this.zenbagarren_galdera]].mota;
	},
	
	// Uneko galderaren testua itzultzen du
	itzuli_galderaren_testua: function() {
		return this.galderak[this.id_galderak[this.zenbagarren_galdera]].testua;
	},
    
    // n. galderaren denbora (noiz) itzultzen du.
    // Kontutan izan n. galderaren indizea n - 1 dela id_galderak arrayan.
    itzuliGalderaNoiz: function(zenbagarrena) {
        
        return this.galderak[this.id_galderak[zenbagarrena - 1]].noiz;
        
    },
    
	// Uneko galdera zenbagarrena den itzultzen du
	itzuli_zenbagarren_galdera: function() {
		return this.zenbagarren_galdera + 1;
	}
};

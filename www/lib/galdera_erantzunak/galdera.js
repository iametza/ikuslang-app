function Galdera(id, testua, mota, erantzunanitza, erantzun_mota, fitxategia, noiz){
	// Objektu bakoitzak izango dituen berezko propietateak
	this.id = id; // Galderaren IDa
	
	this.testua = testua; // Galderaren testua
	
	/*
	 * Galdera mota:
	 * 	testua -> testua soilik (balio lehenetsia),
	 *  argazkia -> argazkiarekin,
	 *  soinua -> soinuarekin
	 */
	if (typeof(mota) === 'undefined') {
		this.mota = "testua";
	} else {
		this.mota = mota;
	}
	
	/* Galderak erantzun zuzen bat baino gehiago duen ala ez (true ala false)
	 * Erantzun zuzen kopuru aldakorra (0tik erantzun kopuru arte): true
	 * Erantzun zuzen bakarra: false
	 */
	if (typeof(erantzunanitza) === "undefined") {
		this.erantzunanitza = false;
	} else {
		this.erantzunanitza = erantzunanitza;
	}
	
	/*
	 * Galderak ze erantzun mota izango duen:
	 * 	testua -> erantzunak testuak dira
	 *  irudia -> erantzunak irudiak dira
	 *  mapa -> erantzunak mapako bideak dira
	 */
	if (typeof(erantzun_mota) === 'undefined') {
		this.erantzun_mota = "testua";
	} else {
		this.erantzun_mota = erantzun_mota;
	}
	
	/*
	 * Galderarekin lotutako fitxategiaren ezaugarri bat:
	 * irudia: URLa,
	 * soinua: soundmanager-en id-a,
	 * mapa: dagokion paths aldagaiaren izena
	 * beharrezko ez denean undefined egongo da.
	 */
	this.fitxategia = fitxategia;

	/*
	 * Galdera noiz bistaratu behar den (segundotan),
	 * beharrezko ez denean undefined egongo da.
	 */
	this.noiz = noiz;
    
	this.erantzunak = {}; // Galderaren erantzunak
}

// Objektu guztiek konpartituko dituzten metodoak
Galdera.prototype = {
	gehitu_erantzuna: function(id_erantzuna, testua, zuzena_da, id_erantzuna_db) {
		this.erantzunak[id_erantzuna] = new Erantzuna(id_erantzuna, testua, zuzena_da, id_erantzuna_db);
	}
};

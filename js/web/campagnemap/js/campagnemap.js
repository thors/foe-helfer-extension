/*
 * **************************************************************************************
 *
 * Dateiname:                 campagnemap.js
 * Projekt:                   foe-chrome
 *
 * erstellt von:              Daniel Siekiera <daniel.siekiera@gmail.com>
 * erstellt am:	              22.12.19, 14:31 Uhr
 * zuletzt bearbeitet:       22.12.19, 14:31 Uhr
 *
 * Copyright © 2019
 *
 * **************************************************************************************
 */

let KampagneMap = {
    Provinces: null,
    AllProvinces: null,

    /**
     * Zeigt
     * @constructor
     */
    Show: () => {
        if ($('#campagne').length === 0) {
            let args = {
                'id': 'campagne',
                'title': i18n['Boxes']['Campagne']['Title'],
                'auto_close': true,
                'dragdrop': true,
                'minimize': false
            };
            HTML.Box(args);
        }

        KampagneMap.BuildBox();
    },


    /**
	 *
	 * @constructor
	 */
    BuildBox: () => {
        KampagneMap.CalcBody();
    },


    /**
	 *
	 * @constructor
	 */
    CalcBody: () => {

        let h = [];

        if (KampagneMap.Provinces === null)
            return;

        let OffeneProvinzen = [];
        KampagneMap.Provinces.forEach(prov => {
            if (prov['isPlayerOwned'] === false) {
                OffeneProvinzen.push(prov);
            }
        });

        let CurrentProvince = KampagneMap.AllProvinces.find(obj => {
            if (obj['id'] !== undefined)
                return obj['id'] === KampagneMap.Provinces[0]['provinceId'];
        });

        if (OffeneProvinzen.length === 0) {
            h.push('<div class="campagne-head">');
            h.push('<div class="text-center"><strong>' + CurrentProvince['name'] + '</strong></div>');
            h.push('<div><strong>' + i18n['Boxes']['Campagne']['AlreadyDone'] + '</strong></div>');
            h.push('</div>');
            $('#campagneBody').html(h.join(''));
        }

        else{
            let RequiredResources = [];
            let Rewards = []

            OffeneProvinzen.forEach(prov => {
                for (let ResourceName in prov['resourcePrice']['resources']) {

                	if(!prov['resourcePrice']['resources'].hasOwnProperty(ResourceName)){
                		break;
					}

                    if (RequiredResources[ResourceName] === undefined)
                        RequiredResources[ResourceName] = 0;

                    RequiredResources[ResourceName] += prov['resourcePrice']['resources'][ResourceName];
                }

                if (Rewards[prov['reward']['type']] === undefined)
                    Rewards[prov['reward']['type']] = 0;

                Rewards[prov['reward']['type']] += prov['reward']['amount']
            });

            h.push('<div class="campagne-head">');
            h.push('<div class="text-center"><strong>' + CurrentProvince['name'] + '</strong></div>');
            h.push('</div>');
    
            h.push('<div class="campagne-head">');
            h.push('<div class="text-center"><strong>' + i18n['Boxes']['Campagne']['Reward'] + ': </strong></div>');

            for (let RewardTyp in Rewards) {
            	if(!Rewards.hasOwnProperty(RewardTyp)){
            		break;
				}
                h.push('<div><strong> ' + Rewards[RewardTyp] + ' ' + GoodsData[RewardTyp]['name'] + '</strong></div>');
            }

            h.push('</div>');
    
            h.push('<table class="foe-table">');
            h.push('<thead>' +
                '<tr>' +
                '<th>' + i18n['Boxes']['Campagne']['Resource'] + '</th>' +
                '<th>' + i18n['Boxes']['Campagne']['DescRequired'] + '</th>' +
                '<th>' + i18n['Boxes']['Campagne']['DescInStock'] + '</th>' +
                '<th class="text-right">' + i18n['Boxes']['Campagne']['DescStillMissing'] + '</th>' +
                '</tr>' +
                '</thead>');
    
            // Reihenfolge der Ausgabe generieren
            let OutputList = ['strategy_points', 'money', 'supplies'];

            for (let i = 0; i < 70; i++) {
                OutputList[OutputList.length] = GoodsList[i]['id'];
            }
            OutputList[OutputList.length] = 'promethium';

            for (let i = 70; i < 75; i++) {
                OutputList[OutputList.length] = GoodsList[i]['id'];
            }
            OutputList[OutputList.length] = 'orichalcum';

            for (let i = 75; i < GoodsList.length; i++) {
                OutputList[OutputList.length] = GoodsList[i]['id'];
            }

            for (let i = 0; i < OutputList.length; i++) {
                let ResourceName = OutputList[i];

                if (RequiredResources[ResourceName] !== undefined) {
                    let Required = RequiredResources[ResourceName],
                    	Stock = ResourceStock[ResourceName];

                    if (Stock === undefined)
                    	Stock = 0;

                    let Diff = Stock - Required;

                    h.push('<tr>');
                    h.push('<td>' + GoodsData[ResourceName]['name'] + '</td>');
                    h.push('<td>' + HTML.Format(Required) + '</td>');
                    h.push('<td>' + HTML.Format(Stock) + '</td>');
                    h.push('<td class="text-right text-' + (Diff < 0 ? 'danger' : 'success') + '">' + HTML.Format(Diff) + '</td>');
                    h.push('</tr>');
                }
            }

            h.push('</table');

            $('#campagneBody').html(h.join(''));
        }
    },
};
'use strict';
unitDb.controllers = {
    homeCtrl: ['$scope', '$window', '$location', '$hotkey', 'data', function($scope, $window, $location, $hotkey, data) {
        $scope.factions = [];
        $scope.kinds = [];
        $scope.tech = [];

        $scope.index = data.items;
        $scope.version = data.version;
        $scope.contenders = data.contenders;

        var toggleArray = function(arr, el) {
            var idx = arr.indexOf(el);
            if (idx >= 0) {
                arr = arr.splice(idx, 1);
            } else {
                arr.push(el);
            }
        },
        isInArray = function(arr, el) {
            return arr.indexOf(el) >= 0;
        };

        $scope.toggleFaction = function(f) {
            toggleArray($scope.factions, f);
        };
        $scope.factionSelected = function(f) {
            return isInArray($scope.factions, f);
        };
        $scope.toggleKind = function(k) {
            toggleArray($scope.kinds, k);
        };
        $scope.kindSelected = function (k) {
            return isInArray($scope.kinds, k);
        };
        $scope.toggleTech = function(t) {
            toggleArray($scope.tech, t);
        };
        $scope.techSelected = function(t) {
            return isInArray($scope.tech, t);
        };
        $scope.compare = function(item) {
            item.selected = !item.selected;

            var idx = $scope.contenders.indexOf(item.id);
            if (idx === -1)
                $scope.contenders.push(item.id);
            else
                $scope.contenders.splice(idx, 1);
        };
        $scope.clear = function() {
            for (var c in $scope.index)
                if ($scope.index[c].selected)
                    $scope.index[c].selected = false;

            // clear the array without loosing reference
            $scope.contenders.length = 0;
        };
        $scope.strain = function(e) {
            return ($scope.factions.length === 0 || isInArray($scope.factions, e.faction)) &&
                       ($scope.kinds.length === 0 || isInArray($scope.kinds, e.classification)) &&
                       ($scope.tech.length === 0 || isInArray($scope.tech, e.tech));
        };

        var lastClickTime = 0;
        var lastClickUnit = null;
        var maxDoubleClickDelay = 500; //in miliseconds

        $scope.unitClick = function(unit, event) {
            //What happens when the user click on a unit thumbnail in the home
            //view (the click actually happens in the thumb view)

            if (event.ctrlKey) {//The control key is pressed: we open a new page
                //with only the unit
                $window.open('#/' + unit.id, '_blank');

            } else {
                var newTime = (new Date()).getTime();

                if ((lastClickUnit === unit) && //it a double click: we go to
                        (newTime - lastClickTime) < maxDoubleClickDelay) { //compare view
                    if (!unit.selected)
                        $scope.compare(unit);

                    var newURL = '/' + $scope.contenders.join(',');
                    $scope.$apply($location.path( newURL ));

                } else {
                    lastClickUnit = unit;
                    lastClickTime = newTime;
                    $scope.compare(unit);
                }
            }
        };

        $hotkey.bind('Ctrl + X', $scope.clear);
        $hotkey.bind('Ctrl + Z', function() {
            angular.element('#filter').focus();
        });
    }],

    gdiCtrl: ['$scope', '$window', '$location', '$hotkey', 'data', function($scope, $window, $location, $hotkey, data) {
        $scope.compact = false || (localStorage.getItem('compact') === 'true');

        $scope.factions = data.selectedFilterFractions;
        $scope.kinds = data.selectedFilterKinds;
        $scope.tech = data.selectedFilterTech;

        $scope.index = data.items;
        $scope.version = data.version;
        $scope.visibleIndex = data.visibleIndex;
        $scope.contenders = data.contenders;

        var toggleArray = function(arr, el) {
            var idx = arr.indexOf(el);
            if (idx >= 0) {
                arr = arr.splice(idx, 1);
            } else {
                arr.push(el);
            }
        },
        isInArray = function(arr, el) {
            return arr.indexOf(el) >= 0;
        };

        $scope.toggleFaction = function(f) {
            toggleArray($scope.factions, f);
        };
        $scope.factionSelected = function(f) {
            return isInArray($scope.factions, f);
        };
        $scope.toggleKind = function(k) {
            toggleArray($scope.kinds, k);
        };
        $scope.kindSelected = function (k) {
            return isInArray($scope.kinds, k);
        };
        $scope.toggleTech = function(t) {
            toggleArray($scope.tech, t);
        };
        $scope.techSelected = function(t) {
            return isInArray($scope.tech, t);
        };
        $scope.toggleBpSelected = function(item) {
            item.selected = !item.selected;

            var idx = $scope.contenders.indexOf(item.id);
            if (idx === -1)
                $scope.contenders.push(item.id);
            else
                $scope.contenders.splice(idx, 1);
        };
        $scope.setBpSelected = function(item,selected) {
            item.selected = selected;

            var idx = $scope.contenders.indexOf(item.id);
            if (idx === -1 && selected )
                $scope.contenders.push(item.id);
            else if ( !selected )
                $scope.contenders.splice(idx, 1);
        };
        $scope.toggleBpSelectedByGdiClass = function(gdiClass) {
            var classItems = _.sortBy(
                                        _.filter($scope.index,
                                                 function(e) { return gdiClass === e.gdiClassification && $scope.strain(e); }),
                                     function(x) { return x.factionId + x.id.substr(-4); });
            var newStateIsSelected = true;
            if ( classItems.length > 0 ) {
                newStateIsSelected = !classItems[0].selected;
            }
            for (var c in classItems)
                $scope.setBpSelected( classItems[c], newStateIsSelected );
        };
        $scope.clear = function() {
            for (var c in $scope.index)
                if ($scope.index[c].selected)
                    $scope.index[c].selected = false;

            $scope.contenders.splice($scope.contenders.len);
        };
        $scope.strain = function(e) {
            return ($scope.factions.length === 0 || isInArray($scope.factions, e.faction)) &&
                       ($scope.kinds.length === 0 || isInArray($scope.kinds, e.classification)) &&
                       ($scope.tech.length === 0 || isInArray($scope.tech, e.tech));
        };
        $scope.uniqGdiClass = function(e,idx) {
            if ( idx === 0 || e.gdiClassification !== $scope.lastDisplayedGdiClassification ) {
                $scope.lastDisplayedGdiClassification = e.gdiClassification;
                return e.gdiClassification;
            }
        };
        $scope.uniqGdiBaseClass = function(e,idx) {
            if ( idx === 0 || e.gdiBaseClassification !== $scope.lastDisplayedGdiBaseClassification ) {
                $scope.lastDisplayedGdiBaseClassification = e.gdiBaseClassification;
                return e.gdiBaseClassification;
            }
        };
        $scope.compare = function(item) {
            item.selected = !item.selected;

            var idx = $scope.contenders.indexOf(item.id);
            if (idx === -1)
                $scope.contenders.push(item.id);
            else
                $scope.contenders.splice(idx, 1);
        };

        var lastClickTime = 0;
        var lastClickUnit = null;
        var maxDoubleClickDelay = 500; //in miliseconds

        $scope.unitClick = function(unit, event) {
            //What happens when the user click on a unit thumbnail in the home
            //view (the click actually happens in the thumb view)

            if (event.ctrlKey) {//The control key is pressed: we open a new page
                //with only the unit
                $window.open('#/' + unit.id, '_blank');

            } else {
                var newTime = (new Date()).getTime();

                if ((lastClickUnit === unit) && //it a double click: we go to
                    (newTime - lastClickTime) < maxDoubleClickDelay) { //compare view
                    if (!unit.selected)
                        $scope.compare(unit);

                    var newURL = '/' + $scope.contenders.join(',');
                    $scope.$apply($location.path( newURL ));

                } else {
                    lastClickUnit = unit;
                    lastClickTime = newTime;
                    $scope.compare(unit);
                }
            }
        };

        $scope.toggleCompact = function() {
            $scope.compact = !$scope.compact;
            localStorage.setItem('compact', $scope.compact);
        };

        $hotkey.bind('Ctrl + X', $scope.clear);
        $hotkey.bind('Ctrl + Z', function() {
            angular.element('#filter').focus();
        });
    }],

    compareCtrl: ['$window', '$scope', '$routeParams', 'NgTableParams', 'ngTableEventsChannel', 'data', function($window, $scope, $routeParams, NgTableParams, ngTableEventsChannel, data) {
        $scope.layoutClass = localStorage.getItem('compareLayout');

        let ids = $routeParams.ids.split(',');
        $scope.contenders = _.sortBy(_.filter(data.items, function(x) { return _.contains(ids, x.id); }),
                                    function(x) { x.tmpSelectionOrder=ids.indexOf(x.id); return x.tmpSelectionOrder; });
        if (_.contains(ids, "all")) {
          $scope.contenders = _.filter(data.items, function(x) { x.tmpSelectionOrder=42; return true; });
        }
        console.log($scope.contenders);
        let tablesVisibleRowsCounts = [];

        let startSelectionSortOrderColumn = {
          field: 'tmpSelectionOrder',
          sortable: 'tmpSelectionOrder',
        }
        let factionColumn = {
          field: 'faction',
          title: 'Faction',
          sortable: 'faction',
          groupable: 'faction'
        }
        let factionColumn2d = {
          field: 'faction',
          title: 'Faction',
          sortable: 'unit.faction',
          groupable: 'unit.faction'
        }
        let unitColumn = {
          field: 'fullName',
          title: 'Unit',
          sortable: 'fullName',
        }
        let firingCycleColumn = {
          field: 'FiringCycle',
          title: 'FiringCycle'
        }
        let dpsTimesWeaponNumberColumn = {
          field: 'dpsTimesWeaponNumber',
          title: 'dps*WeaponNumber',
          sortable: 'weapon.dpsTimesWeaponNumber'
        }

        let enhancementUpgradeColumn = {
          field: 'enhancement',
          title: 'Upgrade',
          sortable: 'enhancement',
          groupable: 'enhancement'
        }
        let idColumn = {
          field: 'id',
          title: 'Id',
          sortable: 'id',
        };
        let headerColumns = [startSelectionSortOrderColumn,factionColumn,unitColumn,idColumn]
        $scope.shieldTableColumns = []
        let shieldTableAlreadyCreatedColumns = [];
        let shieldTableAlwaysIgnoredFeatures = ['ShieldRegenStartTime'];
        $scope.economyTableColumns = [startSelectionSortOrderColumn,factionColumn,unitColumn];
        let economyTableAlreadyCreatedColumns = [];
        let economyTableAlwaysIgnoredFeatures = ['BuildCostMass','BuildCostEnergy','BuildTime'];
        let abilities = [];
        let weaponFeatureColumns = [startSelectionSortOrderColumn,idColumn,unitColumn, firingCycleColumn,dpsTimesWeaponNumberColumn,factionColumn2d];
        let enhancements = [];
        let enhancementsWithUnit = [];
        let enhancementFeatures = [];
        let enhancementFeatureColumns = [startSelectionSortOrderColumn,idColumn,unitColumn, enhancementUpgradeColumn,factionColumn2d];
        let weaponsWitUnit = [];
        for ( let itemIndex in $scope.contenders ) {
          let item = $scope.contenders[itemIndex];
          if ( item.Defense && item.Defense.Shield ) {
            for ( let shieldFeature in item.Defense.Shield ) {
              if ( shieldTableAlwaysIgnoredFeatures.indexOf( shieldFeature ) !== -1 ) {
                  continue;
              }
              if ( shieldTableAlreadyCreatedColumns.indexOf( shieldFeature ) === -1 ) {
                let titleString = shieldFeature;
                if ( shieldFeature in unitDb.readableShieldFeatures ) {
                    titleString = unitDb.readableShieldFeatures[shieldFeature];
                }
                $scope.shieldTableColumns.push({
                    field: shieldFeature,
                    title: titleString,
                    sortable: 'Defense.Shield.'+shieldFeature+' || -2000000000'
                });
                shieldTableAlreadyCreatedColumns.push( shieldFeature );
              }
            }
            $scope.needTableShield = true;
          }
          if ( item.Display && item.Display.Abilities ) {
            $scope.needTableAbilities = true;
            for ( let abilityIndex in item.Display.Abilities ) {
              let ability = item.Display.Abilities[abilityIndex];
              if ( abilities.indexOf(ability) === -1 ) {
                abilities.push(ability);
              }
            }
          }

          if ( item.Economy ) {
            for ( let economyFeature in item.Economy ) {
              if ( economyTableAlwaysIgnoredFeatures.indexOf( economyFeature ) !== -1 ) {
                  continue;
              }
              item.showInTableEconomy = true;
              if ( economyTableAlreadyCreatedColumns.indexOf( economyFeature ) === -1 ) {
                let titleString = economyFeature;
                if ( economyFeature in unitDb.readableEconomyFeatures ) {
                    titleString = unitDb.readableEconomyFeatures[economyFeature];
                }
                $scope.economyTableColumns.push({
                    field: economyFeature,
                    title: titleString,
                    sortable: 'Economy.'+economyFeature+' || -2000000000'
                });
                economyTableAlreadyCreatedColumns.push( economyFeature );
                $scope.needTableEconomy = true;
              }
            }
          }
          if ( item.Physics ) {
            $scope.needTablePhysics = true;
          }
          if ( item.Air ) {
            $scope.needTableAirPhysics = true;
          }
          if ( item.Wreckage ) {
            $scope.needTableWreckage = true;
          }
          if ( item.Weapon ) {
            $scope.needTableWeapons = true;
            for ( let weaponIndex in item.Weapon ) {
              let weapon = item.Weapon[weaponIndex];
              let weaponWithUnit = {weapon: weapon, unit:item};
              weaponWithUnit.tmpSelectionOrder=ids.indexOf(item.id);
              weaponWithUnit.id = item.id;
              weaponWithUnit.fullName=item.fullName;
              weaponsWitUnit.push(weaponWithUnit);
              for ( let weaponFeature in weapon ) {
                let foundCurrentWeaponFeature = false;
                for ( let searchWeaponFeatureIndex in weaponFeatureColumns ) {
                  if ( weaponFeature === weaponFeatureColumns[searchWeaponFeatureIndex].field ) foundCurrentWeaponFeature = true;
                }
                if ( foundCurrentWeaponFeature ) continue;
                let featureTitle = weaponFeature;
                if ( weaponFeature === 'DisplayName' ) {
                  featureTitle = 'Weapon';
                }
                let weaponFeatureColumn = {
                  field: weaponFeature,
                  title: featureTitle,
                  sortable: 'weapon.'+weaponFeature+' || -2000000000'
                };
                weaponFeatureColumns.push( weaponFeatureColumn );
              }
              if ( weapon.dps ) {
                if ( weapon.WeaponNumber ) {
                  weapon.dpsTimesWeaponNumber = weapon.WeaponNumber * weapon.dps
                } else {
                  weapon.dpsTimesWeaponNumber = weapon.dps
                }
              } else {
                weapon.dpsTimesWeaponNumber = 0
              }
            }
          }
          if ( item.Enhancements ) {
            $scope.needTableEnhancements = true;
            for ( let enhancement in item.Enhancements ) {
              if ( enhancements.indexOf( enhancement ) === -1 ) {
                enhancements.push( enhancement );
              }
              let enhancementWithUnit = {enhancement:enhancement,unit:item};
              enhancementWithUnit.tmpSelectionOrder=ids.indexOf(item.id);
              enhancementWithUnit.id = item.id;
              enhancementWithUnit.fullName=item.fullName;
              enhancementsWithUnit.push(enhancementWithUnit);
              for ( let enhancementFeature in item.Enhancements[enhancement] ) {
                if ( enhancementFeatures.indexOf( enhancementFeature ) === -1 ) {
                  enhancementFeatures.push( enhancementFeature );
                  let enhancementFeatureColumn = {
                    field: enhancementFeature,
                    title: enhancementFeature,
                    sortable: 'unit.Enhancements[enhancement].'+enhancementFeature+' || -2000000000'
                  };
                  enhancementFeatureColumns.push(enhancementFeatureColumn);
                }
              }
            }
          }
        }
        let shieldTableColumnsSortMap = {
          'tmpSelectionOrder': 10,
          'faction': 11,
          'fullName': 20,
          'ShieldMaxHealth': 30,
          'ShieldRegenRate': 40,
          'ShieldSize': 50,
          'ShieldRechargeTime': 60,
          'id': 131072,
        };
        let shieldTableColumnsSort = function(x) { return shieldTableColumnsSortMap[x.field] || 65535; };
        $scope.shieldTableColumns = _.sortBy($scope.shieldTableColumns.concat(headerColumns),shieldTableColumnsSort);
        let weaponFeatureSortMap = {
          'tmpSelectionOrder': 10,
          'faction': 11,
          'fullName': 20,
          'DisplayName': 30,
          'dpsTimesWeaponNumber': 40,
          'dps': 41,
          'WeaponNumber': 42,
          'RateOfFire': 49,
          'Damage': 50,
          'DamageRadius': 51,
          'ManualFire': 60,
          'DamageType': 70,
          'NukeOuterRingDamage': 80,
          'NukeOuterRingRadius': 81,
          'NukeInnerRingDamage': 82,
          'NukeInnerRingRadius': 83,
          'MaxRadius': 90,
          'MinRadius': 91,
          'FiringTolerance': 100,
          'FiringRandomness': 101,
          'FiringCycle': 105,
          'TurretPitch': 110,
          'TurretPitchRange': 111,
          'TurretPitchSpeed': 112,
          'TurretYaw': 113,
          'TurretYawRange': 114,
          'TurretYawSpeed': 115,
          'MuzzleSalvoSize': 120,
          'MuzzleSalvoDelay': 121,
          'MuzzleVelocity': 122,
          'ProjectilesPerOnFire': 130,
          'ProjectileLifetimeUsesMultiplier': 131,
          'ProjectileId': 132,
          'RackBones': 140,
          'RackSalvoChargeTime': 141,
          'RackSalvoReloadTime': 142,
          'RackFireTogether': 143,
          'id': 131072,
        };
        let weaponFeatureColumnsSort = function(x) { return weaponFeatureSortMap[x.field] || 65535; };
        let enhancementColumnsSortMap = {
          'tmpSelectionOrder': 10,
          'faction': 11,
          'fullName': 20,
          'Name': 30,
          'enhancement': 40,
          'Slot': 50,
          'BuildCostMass': 60,
          'BuildCostEnergy': 70,
          'BuildTime': 80,
          'AdditionalDamage': 90,
          'NewDamageRadius': 100,
          'NewRateOfFire': 110,
          'NewMaxRadius': 120,
          'NewHealth': 130,
          'NewRegenRate': 140,
          'NewBuildRate': 150,
          'NewOmniRadius': 160,
          'MaintenanceConsumptionPerSecondEnergy': 170,
          'ShieldMaxHealth': 180,
          'ShieldSize': 190,
          'ShieldRechargeTime': 200,
          'ShieldRegenRate': 210,
          'ShieldRegenStartTime': 220,
          'ProductionPerSecondMass': 230,
          'ProductionPerSecondEnergy': 240,
          'Icon': 100000,
          'id': 131072,
        };
        let enhancementColumnsSort = function(x) { return enhancementColumnsSortMap[x.field] || 65535; };
        $scope.enhancementFeatureColumns = _.sortBy(enhancementFeatureColumns,enhancementColumnsSort);

        $scope.abilities = abilities.sort();
        $scope.unitDb = unitDb;

        console.log(enhancements);
        console.log(enhancementFeatures);

        // TODO move me
        $scope.economyTableColumns.push(idColumn);

        let abilityTableColumns = [startSelectionSortOrderColumn,factionColumn,unitColumn];
        for ( let abilityIndex in abilities ) {
          let abilityString = abilities[abilityIndex];
          abilityTableColumns.push({
            field: abilityString,
            title: abilityString,
            sortable: 'Display.Abilities.indexOf(\''+abilityString+'\') != -1',
            normalColumn: true
          });
        }
        abilityTableColumns.push(idColumn);
        $scope.abilityTableColumns = abilityTableColumns;

        $scope.weaponFeatureColumns = _.sortBy(weaponFeatureColumns,weaponFeatureColumnsSort);
        $scope.weaponTableParams = new NgTableParams(
          { count: weaponsWitUnit.length, group: 'weapon.WeaponCategory' },
          { dataset: weaponsWitUnit, counts: tablesVisibleRowsCounts, groupOptions: { isExpanded: false } }
        );
        $scope.weaponGroupsShow = {};

        $scope.testBlubbFunction = function() {
          $scope.weaponTableParams.group('')
        }

        $scope.enhancementTableParams = new NgTableParams({ count: enhancementsWithUnit.length }, { dataset: enhancementsWithUnit, counts: tablesVisibleRowsCounts });
        $scope.enhancementGroupsHide = {};

        $scope.tableParams = new NgTableParams({ count: $scope.contenders.length }, { dataset: $scope.contenders, counts: tablesVisibleRowsCounts });

        $window.sideScrollStyleIndex = -1;
        $window.sideScrollStuff = function(){
          let left = (window.pageXOffset || document.body.scrollLeft) - (document.documentElement.clientLeft || 0);
          if ( sideScrollStyleIndex != -1 ) {
            if ( left > 0 ) {
              document.styleSheets[sideScrollStyleIndex].cssRules[0].style.background = 'rgba(34,34,34,1)';
              document.styleSheets[sideScrollStyleIndex].cssRules[1].style.width = '32px';
//               document.styleSheets[sideScrollStyleIndex].cssRules[2].style.opacity = '0.16';
            } else {
              document.styleSheets[sideScrollStyleIndex].cssRules[0].style.background = 'none';
              document.styleSheets[sideScrollStyleIndex].cssRules[1].style.width = '1px';
//               document.styleSheets[sideScrollStyleIndex].cssRules[2].style.opacity = '1';
            }
            document.styleSheets[sideScrollStyleIndex].cssRules[0].style.left = left+'px';
          }
        };
        $window.sideScrollStuffTimer = -1
        $window.onscroll = function(){
          if ( sideScrollStuffTimer != -1 ) {
            clearTimeout(sideScrollStuffTimer)
            sideScrollStuffTimer = -1
          }
          sideScrollStuffTimer=setTimeout(sideScrollStuff,50)
        };
        $scope.$on('$viewContentLoaded', function() {
          if ( sideScrollStyleIndex == -1 ) {
            sideScrollStyleIndex = document.styleSheets.length;
            let sideScrollStyle = document.createElement("style");
            sideScrollStyle.appendChild(document.createTextNode(""));
            document.head.appendChild(sideScrollStyle);
            document.styleSheets[sideScrollStyleIndex].insertRule( ".sideScrollMeAlways, thead:hover + tbody .sideScrollMe, .unitNameDisplayHoverArea:hover + .unitNameDisplayHoverAreaNeighbor .sideScrollMe { position: relative; left: 0; background: none; opacity: 1; transition:opacity 250ms ease-out;}", 0 );
            document.styleSheets[sideScrollStyleIndex].insertRule( ".unitNameDisplayHoverArea.leftSide { position: fixed; top: 0px; bottom: 0px; left: 0px; width: 1px; height: 100%; z-index: 20;}", 1 );
//             document.styleSheets[sideScrollStyleIndex].insertRule( "tr:hover .sideScrollMe:hover { opacity: 1; transition:opacity 250ms ease-out;}", 2 );
            console.log(document.styleSheets.length);
          }
        });
        $scope.loading = false;
        $scope.finishLoading = function() {
          $window.setTimeout(function(){
            $scope.loading = false;
            $scope.$apply();
          },200);
        };
        $scope.showSection = {};
        $scope.toggleShowSection = function( section ) {
          $scope.loading = true;
          $window.setTimeout(function(){
            $scope.showSection[section] = !$scope.showSection[section];
            $scope.finishLoading();
          });
        };
        $scope.showUnitDetails = function( item ) {
          if ( $scope.activeUnitDetailUnit == item ) {
            $scope.activeUnitDetailUnit = false;
          } else {
            $scope.activeUnitDetailUnit = item;
          }
        };
        $scope.showWeaponCategory = [];
    }]
};

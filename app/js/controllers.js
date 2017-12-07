'use strict';
unitDb.controllers = {
    homeCtrl: ['$scope', '$window', '$location', 'data', function($scope, $window, $location, data) {
        $scope.factions = [];
        $scope.kinds = [];
        $scope.tech = [];

        $scope.index = data.items;
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
    }],

    gdiCtrl: ['$scope', '$window', '$location', 'data', function($scope, $window, $location, data) {
        $scope.factions = data.selectedFilterFractions;
        $scope.kinds = data.selectedFilterKinds;
        $scope.tech = data.selectedFilterTech;

        $scope.index = data.items;
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

            //$scope.contenders = [];
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
    }],

    compareCtrl: ['$window', '$scope', '$routeParams', 'NgTableParams', 'data', function($window, $scope, $routeParams, NgTableParams, data) {
        var ids = $routeParams.ids.split(',');
        $scope.contenders = _.sortBy(_.filter(data.items, function(x) { return _.contains(ids, x.id); }),
                                    function(x) { x.tmpSelectionOrder=ids.indexOf(x.id); return x.tmpSelectionOrder; });
//         $scope.contenders = _.filter(data.items, function(x) { x.tmpSelectionOrder=42; return true; });
        console.log($scope.contenders);
        var tablesVisibleRowsCounts = [];

        var rowHeaderColumns = [{
          field: 'tmpSelectionOrder',
          sortable: 'tmpSelectionOrder',
          firstColumn: true
        },{
          field: 'fullName',
          title: 'Unit',
          sortable: 'fullName',
          secondColumn: true
        }];

        var abilities = [];
        var weaponsWithUnitByCategory = {};
        var weaponFeatureColumnsByCategory = {};
        var weaponFeatures = [];
        var economyFeatures = [];
        var shieldColumns = false;
        for ( var itemIndex in $scope.contenders ) {
          var item = $scope.contenders[itemIndex];
          if ( item.Defense && item.Defense.Shield ) {
            shieldColumns = true;
          }
          if ( item.Display && item.Display.Abilities ) {
            for ( var abilityIndex in item.Display.Abilities ) {
              var ability = item.Display.Abilities[abilityIndex];
              if ( abilities.indexOf(ability) === -1 ) {
                abilities.push(ability);
              }
            }
          }
          if ( item.Economy ) {
            for ( var economyFeature in item.Economy ) {
              if ( economyFeatures.indexOf( economyFeature ) === -1 ) {
                economyFeatures.push( economyFeature );
              }
            }
          }
          if ( item.Weapon ) {
            for ( var weaponIndex in item.Weapon ) {
              var weapon = item.Weapon[weaponIndex];
              if ( ! weapon.WeaponCategory ) {
                console.warn(weapon);
                continue;
              }
              var weaponWithUnit = {weapon: weapon, unit:item};
              weaponWithUnit.tmpSelectionOrder=ids.indexOf(item.id);
              weaponWithUnit.fullName=item.fullName;
              if ( weaponsWithUnitByCategory[weapon.WeaponCategory] ) {
                if ( weapon.WeaponCategory ) {
                  weaponsWithUnitByCategory[weapon.WeaponCategory].push( weaponWithUnit );
                } else {
                  console.warn(weapon);
                }
              } else {
                if ( weapon.WeaponCategory ) {
                  var firingCycleColumn = {
                    field: 'FiringCycle',
                    title: 'FiringCycle'
                  }
                  weaponFeatureColumnsByCategory[weapon.WeaponCategory] = [rowHeaderColumns[0],rowHeaderColumns[1], firingCycleColumn];
                  weaponsWithUnitByCategory[weapon.WeaponCategory] = [weaponWithUnit];
                } else {
                  console.warn(weapon);
                }
              }
              for ( var weaponFeature in weapon ) {
                if ( ['WeaponCategory'].indexOf(weaponFeature) !== -1 ) continue;
                var foundCurrentWeaponFeature = false;
                for ( var searchWeaponFeatureIndex in weaponFeatureColumnsByCategory[weapon.WeaponCategory] ) {
                  if ( weaponFeature === weaponFeatureColumnsByCategory[weapon.WeaponCategory][searchWeaponFeatureIndex].field ) foundCurrentWeaponFeature = true;
                }
                if ( foundCurrentWeaponFeature ) break;
                var weaponFeatureColumn = {
                  field: weaponFeature,
                  title: weaponFeature,
                  sortable: 'weapon.'+weaponFeature+' || -2000000000'
                };
                weaponFeatureColumnsByCategory[weapon.WeaponCategory].push( weaponFeatureColumn );
              }
            }
          }
        }
        var weaponFeatureColumnsByCategorySortMap = {
          'tmpSelectionOrder': 10,
          'DisplayName': 20,
          'fullName': 30,
          'dps': 40,
          'RateOfFire': 41,
          'FiringCycle': 42,
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
          'RackFireTogether': 143
        };
        var weaponFeatureColumnsByCategorySort = function(x) { return weaponFeatureColumnsByCategorySortMap[x.field] || 9999; };
        for ( var weaponsCategory in weaponFeatureColumnsByCategory ) {
          weaponFeatureColumnsByCategory[weaponsCategory]=_.sortBy(weaponFeatureColumnsByCategory[weaponsCategory],weaponFeatureColumnsByCategorySort);
        }
        var weaponTablesParams = [];
        for ( var weaponsCategory in weaponsWithUnitByCategory ) {
          var weaponsList = weaponsWithUnitByCategory[weaponsCategory];
          weaponTablesParams[weaponsCategory] = new NgTableParams({ count: weaponsList.length }, { dataset: weaponsList, counts: tablesVisibleRowsCounts });
        }
        $scope.abilities = abilities.sort();
        $scope.weaponsWithUnitByCategory = weaponsWithUnitByCategory;
        $scope.weaponFeatureColumnsByCategory = weaponFeatureColumnsByCategory;
        $scope.weaponTablesParams = weaponTablesParams;
        $scope.unitDb = unitDb;

        console.log(economyFeatures);

        var economyColumns = [rowHeaderColumns[0],rowHeaderColumns[1]];
        for ( var k in unitDb.advancedEconomyFeaturesAndDescriptionLookup ) {
          var titleString = unitDb.advancedEconomyFeaturesAndDescriptionLookup[k];
          economyColumns.push({
            field: k,
            title: titleString,
            sortable: 'Economy.'+k+' || -2000000000'
          });
        }
        $scope.economyColumns = economyColumns;

        var abilityColumns = [rowHeaderColumns[0],rowHeaderColumns[1]];
        for ( var abilityIndex in abilities ) {
          var abilityString = abilities[abilityIndex];
          abilityColumns.push({
            field: abilityString,
            title: abilityString,
            sortable: 'Display.Abilities.indexOf(\''+abilityString+'\') != -1',
            normalColumn: true
          });
        }
        $scope.abilityColumns = abilityColumns;

        $scope.tableParams = new NgTableParams({ count: $scope.contenders.length }, { dataset: $scope.contenders, counts: tablesVisibleRowsCounts });

        $window.onscroll = function(){
          var left = (window.pageXOffset || document.body.scrollLeft) - (document.documentElement.clientLeft || 0);
//           $('.wfctmpSelectionOrder, .wfcfullName, .wfcDisplayName').css({'position':'relative', 'left': left+'px'});
//           if ( left > 0 ) {
//             $('.wfcfullName div, .wfcDisplayName div').css({'background': 'rgba(34,34,34,0.5)'});
//             $('.wfcfullName, .wfcDisplayName').css({'vertical-align':'top'});
//           } else {
//             $('.wfcfullName div, .wfcDisplayName div').css({'background': 'none'});
//             $('.wfcfullName, .wfcDisplayName').css({'vertical-align':'middle'});
//           }
          $('.wfctmpSelectionOrder, .wfcDisplayName').css({'position':'relative', 'left': left+'px'});
          if ( left > 0 ) {
            $('.wfctmpSelectionOrder, .wfcDisplayName div').css({'background': 'rgba(34,34,34,0.5)'});
            $('.wfcDisplayName').css({'vertical-align':'top'});
          } else {
            $('.wfctmpSelectionOrder, .wfcDisplayName div').css({'background': 'none'});
            $('.wfcDisplayName').css({'vertical-align':'middle'});
          }
        };
    }]
};

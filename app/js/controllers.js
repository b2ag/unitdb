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

        var ids = $routeParams.ids.split(',');
        $scope.contenders = _.sortBy(_.filter(data.items, function(x) { return _.contains(ids, x.id); }),
                                    function(x) { x.tmpSelectionOrder=ids.indexOf(x.id); return x.tmpSelectionOrder; });
        if (_.contains(ids, "all")) {
          $scope.contenders = _.filter(data.items, function(x) { x.tmpSelectionOrder=42; return true; });
        }
        console.log($scope.contenders);
        var tablesVisibleRowsCounts = [];

        var rowHeaderColumns = [{
          field: 'tmpSelectionOrder',
          sortable: 'tmpSelectionOrder',
          firstColumn: true
        },{
          field: 'id',
          title: 'Id',
          sortable: 'id',
          secondColumn: true
        },{
          field: 'fullName',
          title: 'Unit',
          sortable: 'fullName',
          thirdColumn: true
        }];
        var firingCycleColumn = {
          field: 'FiringCycle',
          title: 'FiringCycle'
        }
        var dpsTimesWeaponNumberColumn = {
          field: 'dpsTimesWeaponNumber',
          title: 'dps*WeaponNumber',
          sortable: 'weapon.dps * ( weapon.WeaponNumber || 1 )'
        }

        var enhancementKeyColumn = {
          field: 'enhancement',
          title: 'Upgrade',
          groupable: 'enhancement'
        }

        var abilities = [];
        var weaponFeatures = [];
        var economyFeatures = [];
        var weaponFeatureColumns = [rowHeaderColumns[0],rowHeaderColumns[1],rowHeaderColumns[2], firingCycleColumn,dpsTimesWeaponNumberColumn];
        var enhancements = [];
        var enhancementsWithUnit = [];
        var enhancementFeatures = [];
        var enhancementFeatureColumns = [rowHeaderColumns[0],rowHeaderColumns[1],rowHeaderColumns[2], enhancementKeyColumn];
        var weaponsWitUnit = [];
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
          if ( item.Enhancements ) {
            for ( var enhancement in item.Enhancements ) {
              if ( enhancements.indexOf( enhancement ) === -1 ) {
                enhancements.push( enhancement );
              }
              var enhancementWithUnit = {enhancement:enhancement,unit:item};
              enhancementWithUnit.tmpSelectionOrder=ids.indexOf(item.id);
              enhancementWithUnit.id = item.id;
              enhancementWithUnit.fullName=item.fullName;
              enhancementsWithUnit.push(enhancementWithUnit);
              for ( var enhancementFeature in item.Enhancements[enhancement] ) {
                if ( enhancementFeatures.indexOf( enhancementFeature ) === -1 ) {
                  enhancementFeatures.push( enhancementFeature );
                  var enhancementFeatureColumn = {
                    field: enhancementFeature,
                    title: enhancementFeature,
                    sortable: 'unit.Enhancements[enhancement].'+enhancementFeature+' || -2000000000'
                  };
                  enhancementFeatureColumns.push(enhancementFeatureColumn);
                }
              }
            }
          }
          if ( item.Weapon ) {
            for ( var weaponIndex in item.Weapon ) {
              var weapon = item.Weapon[weaponIndex];
//               if ( ! weapon.WeaponCategory ) {
//                 // TODO FIX Blueprints!
//                 weapon.WeaponCategory = "Unknown"
//               }
              var weaponWithUnit = {weapon: weapon, unit:item};
              weaponWithUnit.tmpSelectionOrder=ids.indexOf(item.id);
              weaponWithUnit.id = item.id;
              weaponWithUnit.fullName=item.fullName;
              weaponsWitUnit.push(weaponWithUnit);
              for ( var weaponFeature in weapon ) {
                var foundCurrentWeaponFeature = false;
                for ( var searchWeaponFeatureIndex in weaponFeatureColumns ) {
                  if ( weaponFeature === weaponFeatureColumns[searchWeaponFeatureIndex].field ) foundCurrentWeaponFeature = true;
                }
                if ( foundCurrentWeaponFeature ) continue;
                var featureTitle = weaponFeature;
                if ( weaponFeature === 'DisplayName' ) {
                  featureTitle = 'Weapon';
                }
                var weaponFeatureColumn = {
                  field: weaponFeature,
                  title: featureTitle,
                  sortable: 'weapon.'+weaponFeature+' || -2000000000'
                };
//                 if ( weaponFeature === 'WeaponCategory' ) {
//                   weaponFeatureColumn.groupable = 'weapon.'+weaponFeature;
//                 }
                weaponFeatureColumns.push( weaponFeatureColumn );
              }
            }
          }
        }
        console.log(weaponFeatureColumns);
        var weaponFeatureSortMap = {
          'tmpSelectionOrder': 10,
          'id': 15,
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
          'RackFireTogether': 143
        };
        var weaponFeatureColumnsSort = function(x) { return weaponFeatureSortMap[x.field] || 9999; };
        var enhancementColumnsSortMap = {
          'tmpSelectionOrder': 10,
          'id': 15,
          'fullName': 20,
          'Name': 30,
          'Slot': 40,
        };
        var enhancementColumnsSort = function(x) { return enhancementColumnsSortMap[x.field] || 9999; };

        $scope.abilities = abilities.sort();
        $scope.unitDb = unitDb;

        console.log(economyFeatures);
        console.log(enhancements);
        console.log(enhancementFeatures);

        var economyColumns = [rowHeaderColumns[0],rowHeaderColumns[1],rowHeaderColumns[2]];
        for ( var k in unitDb.advancedEconomyFeaturesAndDescriptionLookup ) {
          var titleString = unitDb.advancedEconomyFeaturesAndDescriptionLookup[k];
          economyColumns.push({
            field: k,
            title: titleString,
            sortable: 'Economy.'+k+' || -2000000000'
          });
        }
        $scope.economyColumns = economyColumns;

        var abilityColumns = [rowHeaderColumns[0],rowHeaderColumns[1],rowHeaderColumns[2]];
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

        $scope.weaponFeatureColumns = _.sortBy(weaponFeatureColumns,weaponFeatureColumnsSort);
        $scope.weaponTableParams = new NgTableParams(
          { count: weaponsWitUnit.length, group: 'weapon.WeaponCategory' },
          { dataset: weaponsWitUnit, counts: tablesVisibleRowsCounts, groupOptions: { isExpanded: false } }
        );
        $scope.weaponGroupsShow = {};

        $scope.enhancementFeatureColumns = _.sortBy(enhancementFeatureColumns,enhancementColumnsSort);
        $scope.enhancementTableParams = new NgTableParams({ count: enhancementsWithUnit.length }, { dataset: enhancementsWithUnit, counts: tablesVisibleRowsCounts });
        $scope.enhancementGroupsHide = {};

        $scope.tableParams = new NgTableParams({ count: $scope.contenders.length }, { dataset: $scope.contenders, counts: tablesVisibleRowsCounts });

        $window.sideScrollStyleIndex = -1;
        $window.sideScrollStuff = function(){
          var left = (window.pageXOffset || document.body.scrollLeft) - (document.documentElement.clientLeft || 0);
          if ( sideScrollStyleIndex != -1 ) {
            if ( left > 0 ) {
              document.styleSheets[sideScrollStyleIndex].cssRules[0].style.background = 'rgba(34,34,34,1)';
              document.styleSheets[sideScrollStyleIndex].cssRules[1].style.width = '32px';
              document.styleSheets[sideScrollStyleIndex].cssRules[2].style.opacity = '0.16';
            } else {
              document.styleSheets[sideScrollStyleIndex].cssRules[0].style.background = 'none';
              document.styleSheets[sideScrollStyleIndex].cssRules[1].style.width = '1px';
              document.styleSheets[sideScrollStyleIndex].cssRules[2].style.opacity = '1';
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
            var sideScrollStyle = document.createElement("style");
            sideScrollStyle.appendChild(document.createTextNode(""));
            document.head.appendChild(sideScrollStyle);
            document.styleSheets[sideScrollStyleIndex].insertRule( "tr:hover .sideScrollMe, .sideScrollMeAlways, thead:hover + tbody .sideScrollMe, .unitNameDisplayHoverArea:hover + div.unitNameDisplayHoverAreaNeighbor .sideScrollMe { position: relative; left: 0; background: none; opacity: 1; transition:opacity 250ms ease-out;}", 0 );
            document.styleSheets[sideScrollStyleIndex].insertRule( ".unitNameDisplayHoverArea { position: fixed; top: 0px; bottom: 0px; left: 0px; width: 1px; height: 100%; z-index: 20;}", 1 );
            document.styleSheets[sideScrollStyleIndex].insertRule( "tr:hover .sideScrollMe:hover { opacity: 1; transition:opacity 250ms ease-out;}", 2 );
            console.log(document.styleSheets.length);
          }
        });
        $scope.loading = false;
        $scope.updateStickyHeaders = function() {
            $(".stickyheaders th").css({'position': 'sticky', 'top': 0, 'z-index': 1});
        };
        $scope.finishLoading = function() {
          $window.setTimeout(function(){
            $scope.loading = false;
            $scope.$apply();
          },1000);
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

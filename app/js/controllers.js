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
        $scope.contenders = _.filter(data.items, function(x) { x.tmpSelectionOrder=42; return true; });
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
        var firingCycleColumn = {
          field: 'FiringCycle',
          title: 'FiringCycle'
        }
        var enhancementKeyColumn = {
          field: 'enhancement',
          title: 'Upgrade',
          groupable: 'enhancement'
        }

        var abilities = [];
        var weaponCategories = [];
        var weaponFeatures = [];
        var economyFeatures = [];
        var weaponFeatureColumns = [rowHeaderColumns[0],rowHeaderColumns[1], firingCycleColumn];
        var enhancements = [];
        var enhancementsWithUnit = [];
        var enhancementFeatures = [];
        var enhancementFeatureColumns = [rowHeaderColumns[0],rowHeaderColumns[1], enhancementKeyColumn];
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
              var enhancementWithUnit = {'enhancement':enhancement,'unit':item};
              enhancementWithUnit.tmpSelectionOrder=ids.indexOf(item.id);
              enhancementWithUnit.fullName=item.fullName;
              enhancementsWithUnit.push(enhancementWithUnit);
              for ( var enhancementFeature in item.Enhancements[enhancement] ) {
                if ( enhancementFeatures.indexOf( enhancementFeature ) === -1 ) {
                  enhancementFeatures.push( enhancementFeature );
                  var enhancementFeatureColumn = {
                    field: enhancementFeature,
                    title: enhancementFeature,
                    sortable: 'enhancement.'+enhancementFeature+' || -2000000000'
                  };
                  enhancementFeatureColumns.push(enhancementFeatureColumn);
                }
              }
            }
          }
          if ( item.Weapon ) {
            for ( var weaponIndex in item.Weapon ) {
              var weapon = item.Weapon[weaponIndex];
              if ( ! weapon.WeaponCategory ) {
                console.warn(weapon);
                continue;
              } else {
                if ( weaponCategories.indexOf( weapon.WeaponCategory ) === -1 ) {
                  weaponCategories.push( weapon.WeaponCategory );
                }
              }
              var weaponWithUnit = {weapon: weapon, unit:item};
              weaponWithUnit.tmpSelectionOrder=ids.indexOf(item.id);
              weaponWithUnit.fullName=item.fullName;
              weaponsWitUnit.push(weaponWithUnit);
              for ( var weaponFeature in weapon ) {
                var foundCurrentWeaponFeature = false;
                for ( var searchWeaponFeatureIndex in weaponFeatureColumns ) {
                  if ( weaponFeature === weaponFeatureColumns[searchWeaponFeatureIndex].field ) foundCurrentWeaponFeature = true;
                }
                if ( foundCurrentWeaponFeature ) break;
                var featureTitle = weaponFeature;
                if ( weaponFeature === 'DisplayName' ) {
                  featureTitle = 'Weapon';
                }
                var weaponFeatureColumn = {
                  field: weaponFeature,
                  title: featureTitle,
                  sortable: 'weapon.'+weaponFeature+' || -2000000000'
                };
                if ( weaponFeature === 'WeaponCategory' ) {
                  weaponFeatureColumn.groupable = 'weapon.'+weaponFeature;
                }
                weaponFeatureColumns.push( weaponFeatureColumn );
              }
            }
          }
        }
        var weaponFeatureSortMap = {
          'tmpSelectionOrder': 10,
          'DisplayName': 20,
          'fullName': 30,
          'FiringCycle': 39,
          'dps': 40,
          'RateOfFire': 41,
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
        var weaponFeatureColumnsSort = function(x) { return weaponFeatureSortMap[x.field] || 9999; };
        var enhancementColumnsSortMap = {
          'tmpSelectionOrder': 10,
          'Name': 20,
          'fullName': 30
        };
        var enhancementColumnsSort = function(x) { return enhancementColumnsSortMap[x.field] || 9999; };

        $scope.abilities = abilities.sort();
        $scope.unitDb = unitDb;

        console.log(economyFeatures);
        console.log(enhancements);
        console.log(enhancementFeatures);

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

        $scope.weaponFeatureColumns = _.sortBy(weaponFeatureColumns,weaponFeatureColumnsSort);
        $scope.weaponTableParams = new NgTableParams(
          { count: weaponsWitUnit.length, group: 'weapon.WeaponCategory' },
          { dataset: weaponsWitUnit, counts: tablesVisibleRowsCounts, groupOptions: { isExpanded: false } }
        );
        //$scope.weaponGroupsShow = weaponGroupsShow;
        $scope.weaponGroupsShow = {};

        $scope.enhancementFeatureColumns = _.sortBy(enhancementFeatureColumns,enhancementColumnsSort);
        $scope.enhancementTableParams = new NgTableParams(
          { count: enhancementsWithUnit.length, group: 'enhancement' },
          { dataset: enhancementsWithUnit, counts: tablesVisibleRowsCounts, groupOptions: { isExpanded: false } }
        );
        $scope.enhancementGroupsHide = {};

        $scope.tableParams = new NgTableParams({ count: $scope.contenders.length }, { dataset: $scope.contenders, counts: tablesVisibleRowsCounts });
        //$scope.tableParams = new NgTableParams({}, { dataset: $scope.contenders});

        $window.onscroll = function(){
          var left = (window.pageXOffset || document.body.scrollLeft) - (document.documentElement.clientLeft || 0);
          $('.wfctmpSelectionOrder, .wfcDisplayName, .wfcName').css({'position':'relative', 'left': left+'px'});
          if ( left > 0 ) {
            $('.wfctmpSelectionOrder, .wfcDisplayName div, .wfcName div').css({'background': 'rgba(34,34,34,0.5)'});
            $('.wfcDisplayName, .wfcName').css({'vertical-align':'top'});
          } else {
            $('.wfctmpSelectionOrder, .wfcDisplayName div, .wfcName div').css({'background': 'none'});
            $('.wfcDisplayName, .wfcName').css({'vertical-align':'middle'});
          }
        };
        $scope.loading = false;
        $scope.updateStickyHeaders = function() {
          $window.setTimeout(function(){
            $(".stickyheaders").stickyTableHeaders('destroy');
            $(".stickyheaders").stickyTableHeaders();
          });
        };
        $scope.finishLoading = function() {
          $window.setTimeout(function(){
            $scope.updateStickyHeaders();
            $scope.loading = false;
            console.log('aus');
            $scope.$apply();
          },1000);
        };
        $scope.showSection = {};
        $scope.toggleShowSection = function( section ) {
          $scope.loading = true;
          console.log('an');
          $window.setTimeout(function(){
            $scope.showSection[section] = !$scope.showSection[section];
            $scope.finishLoading();
            console.log('blubb');
          });
        };
        $scope.ngTableEventHandler = function( a,b ) {
          console.log(['bla',a,b]);
        }
        ngTableEventsChannel.onAfterReloadData( $scope.ngTableEventHandler, $scope );
        $scope.showWeaponCategory = [];
    }]
};

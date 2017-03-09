
var AWC_OpenLayers = {
    "Map": function Map(options){
        eproj = new OpenLayers.Projection("EPSG:4326");
        mproj = new OpenLayers.Projection("EPSG:3857");
        var map = new OpenLayers.Map('map', {
                "projection": mproj,
                "displayProjection": eproj
                }
                );
        return map;
    },
    // Base layers
    "BaseLayer": {
        "GlobeLight":
            function GlobeLight(options){
                this.server = AWC_OpenLayers.Library.getServer();
                this.source = "TMS";
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.source != undefined )
                        this.source =  options.source;
                }
                this.getURL =
                    function( bounds ){
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) /
                                (res * this.tileSize.w));
                        var y = Math.round((bounds.bottom - this.maxExtent.bottom) /
                                (res * this.tileSize.h));
                        var z = this.map.getZoom();
                        var path = "x=" + x + "&y=" + y + "&z=" + z;
                        var url = this.url;
                        if (url instanceof Array) {
                            url = this.selectUrl(path, url);
                        }
                        return url + "?product=globe_light" + "&" + path;
                    };
                if( this.source == "TMS" ){
                    this.layer = new OpenLayers.Layer.TMS("Earth light",
                            this.server + "/gis/scripts/tc.php", {
                            "layername": this.product,
                            "visibility": true,
                            "getURL": this.getURL,
                            "isBaseLayer": true,
                            "wrapDateLine": true
                            });
                } else {
                    this.layer = new OpenLayers.Layer.WMS(
                            "Earth light",
                            //this.server + "/cgi-bin/mapserver/basic",
                            this.server + "/cgi-bin/tilecache/bin/tilecache.cgi",
                            {
                            "layers": "globe_light",
                            "transparent": "true",
                            "format": "image/png"
                            }, {
                            "isBaseLayer": true,
                            "wrapDateLine": true
                            });
                }
            },
        "GlobeDark":
            function GlobeDark(options){
                this.server = AWC_OpenLayers.Library.getServer();
                this.source = "TMS";
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.source != undefined )
                        this.source =  options.source;
                }
                this.getURL =
                    function( bounds ){
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) /
                                (res * this.tileSize.w));
                        var y = Math.round((bounds.bottom - this.maxExtent.bottom) /
                                (res * this.tileSize.h));
                        var z = this.map.getZoom();
                        var path = "x=" + x + "&y=" + y + "&z=" + z;
                        var url = this.url;
                        if (url instanceof Array) {
                            url = this.selectUrl(path, url);
                        }
                        return url + "?product=globe_dark" + "&" + path;
                    };
                if( this.source == "TMS" ){
                    this.layer = new OpenLayers.Layer.TMS( "Earth dark",
                            this.server + "/gis/scripts/tc.php", {
                            "layername": this.product,
                            "visibility": true,
                            "getURL": this.getURL,
                            "isBaseLayer": true,
                            "wrapDateLine": true
                            }
                            );
                } else {
                    this.layer = new OpenLayers.Layer.WMS(
                            "Earth dark",
                            //this.server + "/cgi-bin/mapserver/basic",
                            this.server + "/cgi-bin/tilecache/bin/tilecache.cgi",
                            {
                            "layers": "globe_dark",
                            "transparent": "true",
                            "format": "image/png"
                            }, {
                            "isBaseLayer": true,
                            "wrapDateLine": true
                            }
                            );
                }
            },
        "Simple":
            function Simple(options){
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.source != undefined )
                        this.source =  options.source;
                }
                this.layer = new OpenLayers.Layer.WMS(
                        "Earth simple",
                        this.server + "/cgi-bin/mapserver/basic",
                        {
                        "layers": "coast,coast-h,cntry,cntry-h,state,state-h,island,lake",
                        "transparent": "true",
                        "format": "image/png"
                        }, {
                        "isBaseLayer": true,
                        "wrapDateLine": true
                        }
                        );
            },
        "GoogleSat":
            function GoogleSat(options){
                this.layer = new OpenLayers.Layer.Google(
                        "Google Sat",
                        {"type": google.maps.MapTypeId.SATELLITE,
                        "numZoomLevels": 22,
                        "isBaseLayer": true,
                        "wrapDateLine": true}
                        )
            },
        "GoogleRoad":
            function GoogleRoad(options){
                this.layer = new OpenLayers.Layer.Google(
                        "Google Road",
                        {"type": google.maps.MapTypeId.ROAD,
                        "numZoomLevels": 22,
                        "isBaseLayer": true,
                        "wrapDateLine": true}
                        )
            },
        "GoogleTerrain":
            function GoogleTerrain(options){
                this.layer = new OpenLayers.Layer.Google(
                        "Google Terrain",
                        {"type": google.maps.MapTypeId.TERRAIN,
                        "numZoomLevels": 22,
                        "isBaseLayer": true,
                        "wrapDateLine": true}
                        )
            }
    },

    "ImageLayer": {
        // Satellite layer
        "Satellite":
            function Satellite( map, options ){
                var self = this;
                this.map = map;
                this.date = null;
                this.date_string = null;
                this.offset = 0;
                this.product = "ir";
                this.opacity = 0.5;
                this.source = "AWC";
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.product != undefined )
                        this.product =  options.product;
                    if( options.offset != undefined )
                        this.offset =  options.offset;
                    if( options.date != undefined )
                        this.date =  options.date;
                    if( options.opacity != undefined )
                        this.opacity =  options.opacity;
                }
                this.setSource = function( value ){
                    this.source = value;
                }
                this.setDate = function( value ){
                    this.date = value;
                    this.updateDate();
                }
                this.setProduct = function( value ){
                    this.product = value;
                    this.layer.layername = value;
                }
                this.getProduct = function(){
                    return this.product;
                }
                this.redraw = function(){
                    this.layer.mergeNewParams();
                    this.layer.redraw();
                };
                this.updateDate = function(){
                    if( this.date != null ){
                        if( this.source == "SSEC" ){
                            var year = this.date.substr(0,4);
                            var month = this.date.substr(4,2);
                            var day = this.date.substr(6,2);
                            var hour = this.date.substr(8,2);
                            var minute = this.date.substr(10,2);
                            this.date_string = year + "-" + month + "-" + day +
                                " " + hour + ":" + minute + ":00";
                        }
                        else
                            this.date_string = this.date;
                    }
                    // Determine latest image
                    else {
                        function pad( val ){
                            if( val < 10 )
                                return "0"+val;
                            else
                                return ""+val;
                        }
                        var d = new Date();
                        d = new Date(Math.floor((d.getTime()-this.offset*60000)/
                                900000)*900000);
                        if( this.source == "SSEC" )
                            this.date_string = d.getUTCFullYear() + "-" +
                                pad( d.getUTCMonth()+1) + "-" +
                                pad( d.getUTCDate()) + " " +
                                pad( d.getUTCHours()) + ":" +
                                pad( d.getUTCMinutes()) + ":" +
                                pad( d.getUTCSeconds());
                        else
                            this.date_string = d.getUTCFullYear() +
                                pad( d.getUTCMonth()+1) +
                                pad( d.getUTCDate()) + pad( d.getUTCHours()) +
                                pad( d.getUTCMinutes()) + pad( d.getUTCSeconds());
                    }
                }
                // Setup URL for tilecache
                this.updateDate();
                if( this.source == "SSEC" ){
                    this.satURL =
                        function( bounds ){
                            var res = this.map.getResolution();
                            var x = Math.round((bounds.left - this.maxExtent.left) /
                                    (res * this.tileSize.w));
                            var y = Math.round((this.maxExtent.top - bounds.top) /
                                    (res * this.tileSize.h));
                            var z = this.map.getZoom();
                            var path = "x=" + x + "&y=" + y + "&z=" + z + "?" +
                                parseInt(Math.random() * 9999);
                            var url = this.url;
                            if (url instanceof Array) {
                                url = this.selectUrl(path, url);
                            }
                            return url + "products=" + self.product + ".90&time=" + self.date_string + "&" + path;
                        };
                    this.satTileCache = [
                        'http://wms.ssec.wisc.edu/tiles/tile_wrapper.php?',
                        'http://wms1.ssec.wisc.edu/tiles/tile_wrapper.php?',
                        'http://wms2.ssec.wisc.edu/tiles/tile_wrapper.php?',
                        'http://wms3.ssec.wisc.edu/tiles/tile_wrapper.php?'];
                    this.layer = new OpenLayers.Layer.TMS("SSEC Satellite",
                            this.satTileCache, {
                            "layername": this.product,
                            "visibility": true,
                            "getURL": this.satURL,
                            "isBaseLayer": false,
                            "opacity": this.opacity
                            });
                } else {
                    this.getURL =
                        function( bounds ){
                            var res = this.map.getResolution();
                            var x = Math.round((bounds.left - this.maxExtent.left) /
                                    (res * this.tileSize.w));
                            var y = Math.round((bounds.bottom - this.maxExtent.bottom) /
                                    (res * this.tileSize.h));
                            var z = this.map.getZoom();
                            var path = "x=" + x + "&y=" + y + "&z=" + z;
                            var url = this.url;
                            if (url instanceof Array) {
                                url = this.selectUrl(path, url);
                            }
                            return url + "?product=sat_"+self.product+"&date="+self.date_string+"&"+path;
                        };
                    this.layer = new OpenLayers.Layer.TMS("Satellite",
                            this.server + "/gis/scripts/tc.php", {
                            "visibility": true,
                            "getURL": this.getURL,
                            "isBaseLayer": false,
                            "wrapDateLine": true,
                            "opacity": this.opacity
                            });
                }
            },
        // Vis/Fog  layer
        "VisFog":
            function VisFog( map, options ){
                var self = this;
                this.layer = null;
                this.map = map;
                this.date = null;
                this.date_string = null;
                this.opacity = 0.75;
                this.url = "/satellite/image";
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.date =  options.date;
                    if( options.opacity != undefined )
                        this.opacity =  options.opacity;
                }
                this.setSource = function( value ){
                    this.source = value;
                }
                this.setDate = function( value ){
                    this.date = value;
                    this.updateDate();
                }
                this.redraw = function(){
                    this.layer.redraw();
                };
                this.getURL = function( ){ return self.url; };
                this.updateDate = function(){
                    if( this.date != null )
                        this.date_string = this.date;
                    // Determine latest image
                    else {
                        function pad( val ){
                            if( val < 10 )
                                return "0"+val;
                            else
                                return ""+val;
                        }
                        var d = new Date();
                        d = new Date(Math.floor(d.getTime()/
                                900000)*900000);
                        this.date_string = d.getUTCFullYear() +
                            pad( d.getUTCMonth()+1) +
                            pad( d.getUTCDate()) + pad( d.getUTCHours()) +
                            pad( d.getUTCMinutes()) + pad( d.getUTCSeconds());
                    }
                    this.url = "/satellite/image?date="+this.date_string;
                    if( this.layer != null ){
                        if( this.layer.visibility ) {
                            this.layer.setUrl( this.url );
                        }
                        else {
                            this.layer.url = this.url;
                        }
                    }

                }
                this.updateDate();

                this.layer = new OpenLayers.Layer.Image("Vis/Fog",
                        AWC_OpenLayers.Library.getServer()+this.url,
                        new OpenLayers.Bounds( -17812972, 557966, -3340835,  8402042 ),
                        new OpenLayers.Size( 1400, 800 ),

                        {
                        "isBaseLayer": false,
                        "wrapDateLine": true,
                        "opacity": this.opacity
                        });
            },
        // Radar layer
        "Radar":
            function Radar( map, options ){
                var self = this;
                this.map = map;
                this.source = "AWC";
                this.offset = 0;
                this.opacity = 0.75;
                this.product = "rala";
                this.layer = null;
                this.date = null;
                this.date_string = null;
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server = options.server;
                    if( options.product != undefined )
                        this.product =  options.product;
                    if( options.offset != undefined )
                        this.offset = options.offset;
                    if( options.date != undefined )
                        this.date = options.date;
                    if( options.opacity != undefined )
                        this.opacity = options.opacity;
                }
                this.setOpacity = function(value){
                    this.opacity = value;
                    if( this.layer != null ) this.layer.setOpacity(value);
                }
                this.setProduct = function( value ){
                    this.product = value;
                }
                this.getProduct = function(){
                    return this.product;
                }
                this.setDate = function( value ){
                    this.date = value;
                    this.updateDate();
                }
                this.updateDate = function(){
                    if( this.date == null )
                        var d = new Date();
                    else
                        var d = new Date( Date.UTC(
                                    this.date.substr(0,4),
                                    this.date.substr(4,2)-1,
                                    this.date.substr(6,2),
                                    this.date.substr(8,2),
                                    this.date.substr(10,2), 0, 0 ));
                    d = new Date(Math.floor((d.getTime()-this.offset*60000)/
                                600000)*600000);
                    function pad( val ){
                        if( val < 10 )
                            return "0"+val;
                        else
                            return ""+val;
                    }
                    if( this.source == "ridge" ){
                        this.date_string = d.getUTCFullYear() +
                            pad( d.getUTCMonth()+1) +
                            pad( d.getUTCDate()) + "_" +
                            pad( d.getUTCHours()) +
                            pad( d.getUTCMinutes()) + pad( d.getUTCSeconds());
                    }
                    else {
                        this.date_string = d.getUTCFullYear() +
                            pad( d.getUTCMonth()+1) +
                            pad( d.getUTCDate()) + pad( d.getUTCHours()) +
                            pad( d.getUTCMinutes()) + pad( d.getUTCSeconds());
                    }
                    if( this.layer != null )
                        this.layer.layername = "ridge::NAT-N0Q-"+
                            this.date_string;
                };
                this.redraw = function(){
                    this.layer.mergeNewParams();
                    this.layer.redraw();
                };
                if( this.source == "ridge" ){
                    // Setup URL for tilecache
                    this.radarURL =
                        function( bounds ){
                            var res = this.map.getResolution();
                            var x = Math.round((bounds.left - this.maxExtent.left) /
                                    (res * this.tileSize.w));
                            var y = Math.round((this.maxExtent.top - bounds.top) /
                                    (res * this.tileSize.h));
                            var z = this.map.getZoom();
                            var path = "/" + z + "/" + x + "/" + y + "." + this.type;
                            var url = this.url + this.layername;
                            if (url instanceof Array) {
                                url = this.selectUrl(path, url);
                            }
                            return url + path;
                        };
                    // Determine latest radar image (need to get this from Ridge site)
                    this.updateDate();

                    var radarTileCache = ["http://ridgewms.srh.noaa.gov/tc/tc.py/1.0.0/"];

                    // Add radar layer
                    this.layer = new OpenLayers.Layer.TMS("Ridge Radar",
                            radarTileCache, {
                            "layername": "ridge::NAT-N0Q-"+this.date_string,
                            "type": 'png',
                            "isBaseLayer": false,
                            "getURL": this.radarURL,
                            "mapType": "radar",
                            "rid": "NAT",
                            "pid": "N0Q",
                            "displayInLayerSwitcher": true,
                            "opacity": this.opacity,
                            "buffer": 0,
                            "visibility": true
                            });
                } else {
                    this.updateDate();
                    this.getURL =
                        function( bounds ){
                            var res = this.map.getResolution();
                            var x = Math.round((bounds.left - this.maxExtent.left) /
                                    (res * this.tileSize.w));
                            var y = Math.round((bounds.bottom - this.maxExtent.bottom) /
                                    (res * this.tileSize.h));
                            var z = this.map.getZoom();
                            var path = "x=" + x + "&y=" + y + "&z=" + z;
                            var url = this.url;
                            if (url instanceof Array) {
                                url = this.selectUrl(path, url);
                            }
                            return url + "?product=rad_"+self.product+"&date="+self.date_string+"&"+path;
                        };
                    this.layer = new OpenLayers.Layer.TMS("AWC Radar",
                            this.server + "/gis/scripts/tc.php", {
                            "visibility": true,
                            "getURL": this.getURL,
                            "isBaseLayer": false,
                            "wrapDateLine": true,
                            "opacity": this.opacity
                            });
                }
            },
        // Weather layer
        "Weather":
            function Weather( map, options ){
                var self = this;
                this.map = map;
                this.opacity = 0.75;
                this.layer = null;
                this.date = null;
                this.date_string = null;
                this.server = AWC_OpenLayers.Library.getServer();
                this.cva_bounds = new OpenLayers.Bounds( -14061383, 2719051, -7066383,  6714051 );
                this.cva_size = new OpenLayers.Size( 1400, 800 );
                this.cip_bounds = new OpenLayers.Bounds( -14990770, 2146482, -6827850, 7585402 );
                this.cip_size = new OpenLayers.Size( 900, 600 );
                this.type = "none";
                this.url = "/cva/image?type=fltcat";
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server = options.server;
                    if( options.date != undefined )
                        this.date = options.date;
                    if( options.type != undefined )
                        this.type = options.type;
                    if( options.opacity != undefined )
                        this.opacity = options.opacity;
                }
                this.setOpacity = function(value){
                    this.opacity = value;
                    if( this.layer != null ) this.layer.setOpacity(value);
                }
                this.setDate = function( value ){
                    this.date = value;
                    this.setUrl();
                }
                this.setUrl = function(){
                    var dstr = "";
                    if( this.date != null ){
                        dstr = "&date="+this.date;
                    } else {
                        var d = new Date();
                        d = new Date(Math.floor(d.getTime()/ 300000)*300000);
                        dstr = "&date="+AWC_OpenLayers.Library.getDate( 
                                Math.floor(d.getTime()/ 300000)*300 );
                    }
                    var f = this.type.split("_");
                    var m = f[0];
                    if( m == "gtg" && f.length == 2 ){
                        var l = f[1];
                        var t = "cat";
                    } else if( f.length == 3 ){
                        var l = f[1];
                        var t = f[2];
                    } else if( f.length == 4 ){
                        var l = f[1];
                        var t = f[2]+"_"+f[3];
                    } else {
                        var l = "";
                        var t = f[1];
                    }
                    if( this.type == "none" )
                        this.url = "/cva/image?type=fltcat"+dstr;
                    else if( m == "cva" )
                        this.url = "/cva/image?type="+t+dstr;
                    else if( m == "lamp" )
                        this.url = "/model/image?model=lamp&level=sfc&type="+t+dstr;
                    else if( m == "rap" )
                        this.url = "/model/image?model=rap&level="+l+"&type="+t+dstr;
                    else if( m == "ndfd" )
                        this.url = "/model/image?model=ndfd&level=sfc&type="+t+dstr;
                    else if( m == "gtg" )
                        this.url = "/turbulence/image?level="+l+"&type="+t+dstr ;
                    else if( m = "fip" )
                        this.url = "/icing/image?level="+l+"&type="+t+dstr ;
                    if( this.layer != null ){
                        //console.log( "M="+m+" L="+l+" T="+t );
                        if( m == "cva" ){
                            this.layer.extent = this.cva_bounds;
                            this.layer.size = this.cva_size;
                        } else {
                            this.layer.extent = this.cip_bounds;
                            this.layer.size = this.cip_size;
                        }
                        if( this.layer.visibility ) 
                            this.layer.setUrl( this.url );
                        else 
                            this.layer.url = this.url;
                    }
                }
                this.setType = function( type ){
                    this.type = type;
                    this.setUrl();
                }
                this.getType = function(){ return this.type; };
                this.redraw = function(){
                    this.layer.redraw();
                };

                if( this.type == "cva_sfc_fltcat" || this.type == "cva_sfc_ceil" || this.type == "cva_sfc_vis" ){
                    var bounds = this.cva_bounds;
                    var size = this.cva_size;
                } else if( this.type == "cva_sfc_fltcat_full" || this.type == "cva_sfc_ceil_full" || this.type == "cva_sfc_vis_full" ){
                    var bounds = this.cva_bounds;
                    var size = this.cva_size;
                } else {
                    var bounds = this.cip_bounds;
                    var size = this.cip_size;
                }
                this.setUrl();
                this.layer = new OpenLayers.Layer.Image(
                        "Weather",
                        this.url,
                        bounds,
                        size,
                        { "isBaseLayer": false,
                        "displayOutsideMaxExtent": true,
                        "alwaysInRange": true,
                        "opacity": this.opacity
                        }
                        );
            }
    },

    "MapLayer": {
        "Basic":
            function Basic(options){
                this.server = AWC_OpenLayers.Library.getServer();
                var gutter = 0;
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.gutter != undefined )
                        gutter =  options.gutter;
                }
                this.setStyle = function(type){
                    if( type == "light" )
                        this.layer.params.STYLES =
                            "light,light,light,light,light,light,light,light,light,light,light,light";
                    else
                        this.layer.params.STYLES =
                            "dark,dark,dark,dark,dark,dark,dark,dark,dark,dark,dark,dark";
                }
                this.layer = new OpenLayers.Layer.WMS(
                        "Map",
                        this.server + "/cgi-bin/mapserver/basic",
                        {"layers": "coast,coast-h,coast-us,cntry,cntry-h,cntry-us,state,state-h,state-us,island,island-us,lake",
                        "styles": "dark,dark,dark,dark,dark,dark,dark,dark,dark,dark,dark,dark",
                        "transparent": true,
                        "format": "image/png"},
                        {"isBaseLayer": false,
                        "wrapDateLine": false,
                        "maxExtent": new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508),
                        "gutter": gutter}
                        );
            },

        // Counties layer
        "Counties":
            function Counties(options){
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                }
                this.setStyle = function(type){
                    if( type == "light" )
                        this.layer.params.STYLES = "light,light,light";
                    else
                        this.layer.params.STYLES = "dark,dark,light";
                }
                this.layer = new OpenLayers.Layer.WMS(
                        "Counties",
                        this.server + "/cgi-bin/mapserver/basic",
                        {
                        "layers": "county,county-h,county_data",
                        "styles": "dark,dark,dark",
                        "transparent": "true",
                        "format": "image/png"
                        }, {
                        "isBaseLayer": false
                        }
                        );
            },

        // Highway layer
        "Highways":
            function Highways(options){
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                }
                this.setStyle = function(type){
                    if( type == "light" )
                        this.layer.params.STYLES = "light,light,light";
                    else
                        this.layer.params.STYLES = "dark,dark,dark";
                }
                this.layer = new OpenLayers.Layer.WMS(
                        "Highways",
                        this.server + "/cgi-bin/mapserver/basic",
                        {
                        "layers": "highway,highway-h,highway-us",
                        "styles": "dark,dark,dark",
                        "transparent": "true",
                        "format": "image/png"
                        }, {
                        "isBaseLayer": false
                        }
                        );
            },

        // Roads layer
        "Roads":
            function Roads(options){
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                }
                this.setStyle = function(type){
                    if( type == "light" )
                        this.layer.params.STYLES = "light,light,light";
                    else
                        this.layer.params.STYLES = "dark,dark,dark";
                }
                this.layer = new OpenLayers.Layer.WMS(
                        "Roads",
                        this.server + "/cgi-bin/mapserver/basic",
                        {
                        "layers": "major-road,minor-road,street",
                        "styles": "dark,dark,dark",
                        "transparent": "true",
                        "format": "image/png"
                        }, {
                        "isBaseLayer": false
                        }
                        );
            },

        // Rivers layer
        "Rivers":
            function Rivers(options){
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                }
                this.setStyle = function(type){
                    if( type == "light" )
                        this.layer.params.STYLES = "light,light,light,light,light";
                    else
                        this.layer.params.STYLES = "dark,dark,dark,dark,dark";
                }
                this.layer = new OpenLayers.Layer.WMS(
                        "Roads",
                        this.server + "/cgi-bin/mapserver/basic",
                        {
                        "layers": "river,river-h,water-h,river-h2,water-h2",
                        "styles": "dark,dark,dark,dark,dark",
                        "transparent": "true",
                        "format": "image/png"
                        }, {
                        "isBaseLayer": false
                        }
                        );
            },

        // Airport runways layer
        "Runways":
            function Airports(options){
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                }
                this.setStyle = function(type){
                    if( type == "light" )
                        this.layer.params.STYLES = "light";
                    else
                        this.layer.params.STYLES = "dark";
                }
                this.layer = new OpenLayers.Layer.WMS(
                        "Airports",
                        this.server + "/cgi-bin/mapserver/basic",
                        {
                        "layers": "airport",
                        "transparent": "true",
                        "format": "image/png"
                        }, {
                        "isBaseLayer": false
                        }
                        );
            },

        // Top jetways layer
        "Jetways":
            function Jetways(options){
                return new AWC_OpenLayers.DataLayer.Jetroutes(options);
            },
        // Jet routes layer
        "Jetroutes":
            function Jetroutes(options){
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                }
                this.setStyle = function(type){
                    if( type == "light" )
                        this.layer.params.STYLES = "light,light";
                    else
                        this.layer.params.STYLES = "dark,dark";
                }
                this.layer = new OpenLayers.Layer.WMS(
                        "Jetroutes",
                        this.server + "/cgi-bin/mapserver/basic",
                        {
                        "layers": "topjetroutes,jetroutes",
                        "transparent": "true",
                        "format": "image/png"
                        }, {
                        "isBaseLayer": false
                        }
                        );
            },
        // Top airways layer
        "Airways":
            function Airways(options){
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                }
                this.setStyle = function(type){
                    if( type == "light" )
                        this.layer.params.STYLES = "light";
                    else
                        this.layer.params.STYLES = "dark";
                }
                this.layer = new OpenLayers.Layer.WMS(
                        "Airways",
                        this.server + "/cgi-bin/mapserver/basic",
                        {
                        "layers": "vairways",
                        "transparent": "true",
                        "format": "image/png"
                        }, {
                        "isBaseLayer": false
                        }
                        );
            },

        // Airspace layer
        "Airspace":
            function Airspace(options){
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                }
                this.setStyle = function(type){
                    if( type == "light" )
                        this.layer.params.STYLES = "light,light,light,light";
                    else
                        this.layer.params.STYLES = "dark,dark,dark,dark";
                }
                this.layer = new OpenLayers.Layer.WMS(
                        "Airways",
                        this.server + "/cgi-bin/mapserver/basic",
                        {
                        "layers": "class_e,class_d,class_c,class_b",
                        "transparent": "true",
                        "format": "image/png"
                        }, {
                        "isBaseLayer": false
                        }
                        );
            },

        // FIR boundaries
        "FIRBoundaries":
            function FIRBoundaries(options){
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                }
                this.layer = new OpenLayers.Layer.WMS(
                        "FIR Boundaries",
                        this.server + "/cgi-bin/mapserver/basic",
                        {
                        "layers": "fir2012",
                        "transparent": "true",
                        "format": "image/png"
                        }, {
                        "isBaseLayer": false,
                        "wrapDateLine": true,
                        "maxExtent": new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508),
                        "gutter": 0
                        }
                        );
            },

        // Lat/lon lines
        "LatLonLines":
            function LatLonLines(options){
                this.server = AWC_OpenLayers.Library.getServer();
                var gutter = 0;
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.gutter != undefined )
                        gutter =  options.gutter;
                }
                this.setStyle = function(type){
                    if( type == "light" )
                        this.layer.params.STYLES = "light,light,light";
                    else
                        this.layer.params.STYLES = "dark,dark,dark";
                }
                this.layer = new OpenLayers.Layer.WMS(
                        "Lat Lon Lines",
                        this.server + "/cgi-bin/mapserver/basic",
                        {
                        "layers": "latlon",
                        "transparent": "true",
                        "format": "image/png"
                        }, {
                        "isBaseLayer": false,
                        "wrapDateLine": true,
                        "maxExtent": new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508),
                        "gutter":gutter
                        }
                        );
            }
    },

    "DataLayer": {
        "Metar":
            function Metar( options ){
                var self = this;
                this.server = AWC_OpenLayers.Library.getServer();
                this.plottype = "model";
                this.decoded = false;
                this.metric = false;
                this.scale = 1;
                this.proto_opts = {
                    "filter": 'prior',
                    "density": 0,
                    "taf": false
                };
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.plottype != undefined )
                        this.plottype =  options.plottype;
                    if( options.scale != undefined )
                        this.scale =  options.scale;
                    if( options.density != undefined )
                        this.proto_opts['density'] =  options.density;
                    if( options.decoded != undefined )
                        this.decoded =  options.decoded;
                    if( options.metric != undefined ){
                        AWC_OpenLayers.Library.metric = options.metric;
                        this.metric =  options.metric;
                    }
                    if( options.taf != undefined )
                        this.proto_opts['taf'] =  options.taf;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.getDate = function(){ return this.proto_opts['date']; };
                this.setPlotType = function( value ){ this.plottype = value; };
                this.getPlotType = function(){ return this.plottype; };
                this.setScale = function( value ){ this.scale = value; };
                this.getScale = function(){ return this.scale; };
                this.setDensity = function( value ){ this.proto_opts['density'] = value; };
                this.getDensity = function(){ return this.proto_opts['density']; };
                this.setTaf = function( value ){ this.proto_opts['taf'] = value; };
                this.getTaf = function(){ return this.proto_opts['taf']; };
                this.setDecoded = function( value ){ this.decoded = value; };
                this.getDecoded = function(){ return this.decoded; };
                this.setMetric =
                    function( value ){
                        AWC_OpenLayers.Library.metric = value;
                        this.metric = value;
                    };
                this.getMetric = function(){ return this.metric; };
                this.redraw = function(){ this.layer.redraw(); };

                var eproj = new OpenLayers.Projection("EPSG:4326");
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/MetarJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/MetarJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                OpenLayers.Strategy.BBOX.prototype.triggerRead = 
                    function() {
                        if (this.response) {
                            this.layer.protocol.abort(this.response);
                            this.layer.events.triggerEvent("loadend");
                        }
                        this.layer.events.triggerEvent("loadstart");
                        this.response = this.layer.protocol.read({
                                "filter": this.createFilter(),
                                "callback": this.merge,
                                "scope": this,
                                "params": {zoom: this.layer.map.getZoom()}

                                });
                    };
                // Set up context for styling
                var context = {
                    "getIconSize":
                        function(feature){
                            var vars = self.plottype.split(",");
                            var size;
                            size = 80*self.scale;
                            if( vars.length == 1 && self.plottype != "" )
                                size = 30*self.scale;
                            if( self.plottype == "model" ||
                                    self.plottype == "cover" ||
                                    self.plottype == "wind" ||
                                    self.plottype == "cat" )
                                size = 80*self.scale;
                            if( self.plottype == "wx" )
                                size = 20*self.scale;
                            return size;
                        },
                    "getIcon":
                        function(feature){
                            var params = "scale=" + self.scale + "&";
                            var url = self.server + '/gis/scripts';
                            var vars = self.plottype.split(",");
                            if( vars.length > 1 ){
                                var cover = false;
                                for( var i = 0; i < vars.length; i++ ){
                                    if(( vars[i] == "id" ) &&
                                            feature.attributes.id != undefined )
                                        params = params + "id=" +
                                            feature.attributes.id + "&";
                                    if( vars[i] == "temp" &&
                                            feature.attributes.temp != undefined )
                                        params = params + "temp=" +
                                            AWC_OpenLayers.Library.outTemp(feature.attributes.temp) + "&";
                                    if( vars[i] == "dew" &&
                                            feature.attributes.dewp != undefined )
                                        params = params + "dewp=" +
                                            AWC_OpenLayers.Library.outTemp(feature.attributes.dewp) + "&";
                                    if( vars[i] == "alt"  &&
                                            feature.attributes.altim != undefined )
                                        params = params + "altim=" +
                                            AWC_OpenLayers.Library.outAltim(feature.attributes.altim) + "&";
                                    if( vars[i] == "cover" ){
                                        if( feature.attributes.cover != undefined ){
                                            params = params + "cover=" +
                                                feature.attributes.cover + "&";
                                            if( feature.attributes.fltcat != undefined )
                                                params = params + "fltcat=" + feature.attributes.fltcat + "&";
                                        }
                                        cover = true;
                                    }
                                    if( vars[i] == "ceil" &&
                                            feature.attributes.ceil != undefined )
                                        params = params + "ceil=" +
                                            feature.attributes.ceil + "&";
                                    if( vars[i] == "wind" ){
                                        if( feature.attributes.wspd != undefined )
                                            params = params + "wspd=" +
                                                feature.attributes.wspd + "&";
                                        if( feature.attributes.wdir != undefined )
                                            params = params + "wdir=" + feature.attributes.wdir + "&";
                                    }
                                    if( vars[i] == "wgst" ){
                                        if( feature.attributes.wgst != undefined )
                                            params = params + "wgst=" + feature.attributes.wgst + "&";
                                    }
                                    if( vars[i] == "vis" &&
                                            feature.attributes.visib != undefined )
                                        params = params + "visib=" +
                                            AWC_OpenLayers.Library.outVisib(feature.attributes.visib) + "&";
                                    if( vars[i] == "wx" &&
                                            feature.attributes.wx != undefined ){
                                        var wx = feature.attributes.wx.replace( "+", "%2B" );
                                        params = params + "wx=" + wx + "&";
                                    }
                                }
                                if( !cover ) params = params + "cover=S&";
                                return url+'/stationicon.php?'+params;
                            }

                            if( self.plottype == "" ){
                                return url+'/stationicon.php?cover=S';
                            }
                            else if( self.plottype == "model" ){
                                if( feature.attributes.id != undefined )
                                    params = params + "id=" +
                                        feature.attributes.id + "&";
                                if( feature.attributes.temp != undefined )
                                    params = params + "temp=" +
                                        AWC_OpenLayers.Library.outTemp(feature.attributes.temp) + "&";
                                if( feature.attributes.dewp != undefined )
                                    params = params + "dewp=" +
                                        AWC_OpenLayers.Library.outTemp(feature.attributes.dewp) + "&";
                                if( feature.attributes.altim != undefined )
                                    params = params + "altim=" +
                                        AWC_OpenLayers.Library.outAltim(feature.attributes.altim) + "&";
                                if( feature.attributes.cover != undefined )
                                    params = params + "cover=" +
                                        feature.attributes.cover + "&";
                                if( feature.attributes.ceil != undefined )
                                    params = params + "ceil=" +
                                        feature.attributes.ceil + "&";
                                if( feature.attributes.wspd != undefined )
                                    params = params + "wspd=" +
                                        feature.attributes.wspd + "&";
                                if( feature.attributes.wgst != undefined )
                                    params = params + "wgst=" + feature.attributes.wgst + "&";
                                if( feature.attributes.wdir != undefined )
                                    params = params + "wdir=" + feature.attributes.wdir + "&";
                                if( feature.attributes.visib != undefined )
                                    params = params + "visib=" +
                                        AWC_OpenLayers.Library.outVisib(feature.attributes.visib) + "&";
                                if( feature.attributes.wx != undefined ){
                                    var wx = feature.attributes.wx.replace( "+", "%2B" );
                                    params = params + "wx=" + wx + "&";
                                }
                                if( feature.attributes.fltcat != undefined )
                                    params = params + "fltcat=" + feature.attributes.fltcat + "&";
                                return url+'/stationicon.php?'+params;
                            }
                            else if( self.plottype == "id" ){
                                params = params + "text=" +
                                    feature.attributes.id;
                                return url+'/txticon.php?'+params;
                            }
                            else if( self.plottype == "temp" ){
                                params = params + "text=" +
                                    AWC_OpenLayers.Library.outTemp(feature.attributes.temp) + "&";
                                return url+'/txticon.php?'+params;
                            }
                            else if( self.plottype == "dew" ){
                                params = params + "text=" +
                                    AWC_OpenLayers.Library.outTemp(feature.attributes.dewp) + "&";
                                return url+'/txticon.php?'+params;
                            }
                            else if( self.plottype == "rhum" ){
                                params = params + "text=" +
                                    AWC_OpenLayers.Library.outRelHum(feature.attributes.temp, feature.attributes.dewp) + "&";
                                return url+'/txticon.php?'+params;
                            }
                            else if( self.plottype == "alt" ){
                                params = params + "text=" +
                                    AWC_OpenLayers.Library.outAltim(feature.attributes.altim) + "&";
                                return url+'/txticon.php?'+params;
                            }
                            else if( self.plottype == "vis" ){
                                params = params + "text=" +
                                    AWC_OpenLayers.Library.outVisib(feature.attributes.visib) + "&";
                                return url+'/txticon.php?'+params;
                            }
                            else if( self.plottype == "ceil" ){
                                if( feature.attributes.ceil != undefined ){
                                    params = params + "text=" + Math.round(feature.attributes.ceil) + "&";
                                    return url+'/txticon.php?'+params;
                                }
                            }
                            else if( self.plottype == "cover" ){
                                if( feature.attributes.fltcat != undefined )
                                    params = params + "fltcat=" + feature.attributes.fltcat + "&";
                                if( feature.attributes.cover != undefined ){
                                    params = params + "cover=" + feature.attributes.cover + "&";
                                    return url+'/stationicon.php?'+params;
                                } else
                                    return url+'/stationicon.php?'+params+"cover=M";
                            }
                            else if( self.plottype == "wind" ){
                                params = "cover=S&";
                                if( feature.attributes.wspd != undefined )
                                    params = params + "wspd=" + feature.attributes.wspd + "&";
                                if( feature.attributes.wdir != undefined )
                                    params = params + "wdir=" + feature.attributes.wdir + "&";
                                return url+'/stationicon.php?'+params;
                            }
                            else if( self.plottype == "wspd" ){
                                params = params + "text=" + Math.round(feature.attributes.wspd) + "&";
                                return url+'/txticon.php?'+params;
                            }
                            else if( self.plottype == "wgst" ){
                                if( feature.attributes.wgst != undefined ){
                                    params = params + "text=" + Math.round(feature.attributes.wgst) + "&";
                                    return url+'/txticon.php?'+params;
                                }
                            }
                            else if( self.plottype == "cat" ){
                                if( feature.attributes.fltcat != undefined )
                                    params = params + "code=" + feature.attributes.fltcat + "&";
                                return url+'/wxicon.php?'+params;
                            }
                            else if( self.plottype == "wx" ){
                                if( feature.attributes.wx != undefined ){
                                    var wx = feature.attributes.wx.replace( "+", "%2B" );
                                    params = params + "code=" + feature.attributes.wx + "&";
                                }
                                return url+'/wxicon.php?'+params;
                            }
                            return url+'/txticon.php?text=-';
                        }
                };
                // Add style to features layer
                var style = new OpenLayers.Style({
                        "externalGraphic": OpenLayers.Util.getImagesLocation() +
                        "blank.gif",
                        "graphicZIndex":10,
                        "backgroundGraphic": "${getIcon}",
                        "backgroundWidth": "${getIconSize}",
                        "backgroundHeight": "${getIconSize}",
                        "backgroundGraphicZIndex":1,
                        "pointRadius": 8,
                        "opacity": 1
                        }, {
                        "context": context
                        }
                        );

                // Create features layer for METAR output
                this.layer = new OpenLayers.Layer.Vector( "Metar", {
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": new OpenLayers.StyleMap(style),
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white; font-weight: bold'>METAR: " +
                        feature.attributes.id + " ["+feature.attributes.site+
                        "]</div>";
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        if( self.decoded ){
                        if( feature.attributes.obsTime != undefined )
                        text = text + spancol + "Time: </span>" + feature.attributes.obsTime + "<br/>";
                        if( feature.attributes.temp != undefined )
                        text = text + spancol + "Temperature: </span>" +
                        AWC_OpenLayers.Library.outTemp(feature.attributes.temp) +
                        "&deg;" + AWC_OpenLayers.Library.outTempUnits() + "<br/>";
                        if( feature.attributes.dewp != undefined )
                            text = text + spancol + "Dewpoint: </span>" +
                                AWC_OpenLayers.Library.outTemp(feature.attributes.dewp) +
                                "&deg;" + AWC_OpenLayers.Library.outTempUnits() + "<br/>";
                        if( feature.attributes.altim != undefined )
                            text = text + spancol + "Altimeter: </span>" +
                                AWC_OpenLayers.Library.outAltimLong(feature.attributes.altim) +
                                " " + AWC_OpenLayers.Library.outAltimUnits() + "<br/>";
                        if( feature.attributes.visib != undefined )
                            text = text + spancol + "Visibility: </span>" +
                                AWC_OpenLayers.Library.outVisib(feature.attributes.visib) +
                                " " + AWC_OpenLayers.Library.outVisibUnits() + "<br/>";
                        if( feature.attributes.ceil != undefined )
                            text = text + spancol + "Ceiling: </span>" + feature.attributes.ceil + "00 ft<br/>";
                        if( feature.attributes.cover != undefined )
                            text = text + spancol + "Cloud Cover: </span>" + feature.attributes.cover + "<br/>";
                        if( feature.attributes.wdir != undefined )
                            if( feature.attributes.wdir == 0 && feature.attributes.wspd == 0 )
                                text = text + spancol + "Winds: </span>calm<br/>";
                            else if( feature.attributes.wdir == 0 )
                                text = text + spancol + "Winds: </span>Variable at " + feature.attributes.wspd + " knt<br/>";
                            else {
                                text = text + spancol + "Winds: </span>" + feature.attributes.wdir +
                                    "&deg; at " + feature.attributes.wspd + " knt";
                                if( feature.attributes.wgst != undefined )
                                    text = text + " gusts to " + feature.attributes.wgst + " knt";
                                text = text + "<br/>";
                            }
                        if( feature.attributes.wx != undefined )
                            text = text + spancol + "Weather: </span>" + feature.attributes.wx + "<br/>";
                        if( feature.attributes.fltcat != undefined )
                            text = text + spancol + "Flight Category: </span>" + feature.attributes.fltcat + "<br/>";
                        } else
                            text = text + spancol + "METAR: </span>" + feature.attributes.rawOb + "<br/>";
                        if( feature.attributes.rawTaf ){
                            var taf = feature.attributes.rawTaf.replace( "FROM", "<br/>&nbsp;&nbsp;FROM" );
                            taf = taf.replace( /FM0/g, "<br/>&nbsp;&nbsp;FM0" );
                            taf = taf.replace( /FM1/g, "<br/>&nbsp;&nbsp;FM1" );
                            taf = taf.replace( /FM2/g, "<br/>&nbsp;&nbsp;FM2" );
                            taf = taf.replace( /FM3/g, "<br/>&nbsp;&nbsp;FM3" );
                            taf = taf.replace( /TEMPO/g, "<br/>&nbsp;&nbsp;TEMPO" );
                            taf = taf.replace( /BECMG/g, "<br/>&nbsp;&nbsp;BECMG" );
                            taf = taf.replace( /PROB/g, "<br/>&nbsp;&nbsp;PROB" );
                            text = text + "<hr style='margin:1px 0 1px 0'/>" + spancol + "TAF: </span>" + taf + "<br/>";
                        }
                        text = text + "</div>";
                        var lines = text.match(/<br\/>/g);
                        lines = (lines == null? 0: lines.length);
                        var extra = 0;
                        if( !self.decoded )
                            extra = Math.floor(feature.attributes.rawOb.length/35);
                        var rules = text.match(/<hr\/>/g);
                        rules = (rules == null? 0: rules.length);
                        var height = 14*(1 + lines + extra + rules);
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size( 360, height ),
                                text,
                                null,
                                true,
                                null
                                );
                        feature.popup = popup;

                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        },
                        "rendererOptions": {
                            "yOrdering": true
                        }
                }
                );
            },

        "FltCat":
            function FltCat( options ){
                var self = this;
                this.server = AWC_OpenLayers.Library.getServer();
                this.scale = 1;
                this.proto_opts = {
                    "filter": "prior",
                    "taf": 0,
                    "density": 2,
                    "vfr": 0 };
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.density != undefined )
                        this.proto_opts['density'] =  options.density;
                    if( options.scale != undefined )
                        this.scale =  options.scale;
                    if( options.vfr != undefined )
                        this.proto_opts['vfr'] =  options.vfr;
                    if( options.taf != undefined )
                        this.proto_opts['taf'] =  options.taf;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.getDate = function(){ return this.proto_opts['date']; };
                this.setDensity = function( value ){ this.proto_opts['density'] = value; };
                this.getDensity = function(){ return this.proto_opts['density']; };
                this.setScale = function( value ){ this.proto_opts['scale'] = value; };
                this.getScale = function(){ return this.proto_opts['scale']; };
                this.setVfr = function( value ){ this.proto_opts['vfr'] = value; };
                this.getVfr = function(){ return this.proto_opts['vfr']; };
                this.setTaf = function( value ){ this.proto_opts['taf'] = value; };
                this.getTaf = function(){ return this.proto_opts['taf']; };
                this.useTaf = function( value ){
                    if( value )
                        this.layer.protocol.options.url = this.server+"/gis/scripts/TafJSON.php";
                    else
                        this.layer.protocol.options.url = this.server+"/gis/scripts/MetarJSON.php";
                };
                this.setUrl = function( value ){ this.layer.protocol.url = value; };
                this.redraw = function(){ this.layer.redraw(); };
                var eproj = new OpenLayers.Projection("EPSG:4326");

                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/MetarJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/MetarJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var context = {
                    "getIconSize":
                        function(feature){
                            return 20*self.scale;
                        },
                    "getIcon":
                        function(feature){
                            var params = "";
                            if( feature.attributes.fltcat != undefined )
                                params = params + "code=" + feature.attributes.fltcat + "&";
                            params = params + "&scale="+self.scale;
                            if( feature.attributes.rawTaf != undefined )
                                params = params + "&shadow=000000";
                            return self.server + '/gis/scripts/wxicon.php?'+params;
                        }
                };
                var style = new OpenLayers.Style({
                        "externalGraphic": OpenLayers.Util.getImagesLocation() + "blank.gif",
                        "graphicZIndex":10,
                        "backgroundGraphic": "${getIcon}",
                        "backgroundWidth": "${getIconSize}",
                        "backgroundHeight": "${getIconSize}",
                        "backgroundGraphicZIndex":1,
                        "pointRadius": 8,
                        "opacity": 1
                        }, {
                        "context": context
                        }
                        );
                this.layer = new OpenLayers.Layer.Vector( "FltCat", {
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": new OpenLayers.StyleMap(style),
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white; font-weight: bold'>" +
                        feature.attributes.id+" ["+feature.attributes.site+ "]</div>";
                        if( feature.attributes.ceil != undefined ){
                        var color = "#00AA33";
                        if( feature.attributes.ceil < 5 )
                        color = "#FF00CC";
                        else if( feature.attributes.ceil < 10 )
                        color = "#FF0000";
                        else if( feature.attributes.ceil <= 30 )
                            color = "#0000EE";
                        text = text+spancol+"Ceiling: </span><span style=\"color:"+color+"\">"+feature.attributes.ceil+"00 ft</span><br/>";
                        }
                        if( feature.attributes.visib != undefined ){
                            var color = "#00AA33";
                            if( feature.attributes.visib < 1 )
                                color = "#FF00CC";
                            else if( feature.attributes.visib < 3 )
                                color = "#FF0000";
                            else if( feature.attributes.visib <= 5 )
                                color = "#0000EE";
                            text = text+spancol+"Visibility: </span><span style=\"color:"+color+"\">"+feature.attributes.visib+" sm</span><hr style='margin:1px 0 1px 0'/>";
                        }
                        // Raw TAF from TAF data
                        if( feature.attributes.rawTAF != undefined ){
                            var taf = feature.attributes.rawTAF.replace( "FROM", "<br/>&nbsp;&nbsp;FROM" );
                            taf = taf.replace( /FM0/g, "<br/>&nbsp;&nbsp;FM0" );
                            taf = taf.replace( /FM1/g, "<br/>&nbsp;&nbsp;FM1" );
                            taf = taf.replace( /FM2/g, "<br/>&nbsp;&nbsp;FM2" );
                            taf = taf.replace( /FM3/g, "<br/>&nbsp;&nbsp;FM3" );
                            taf = taf.replace( /TEMPO/g, "<br/>&nbsp;&nbsp;TEMPO" );
                            taf = taf.replace( /BECMG/g, "<br/>&nbsp;&nbsp;BECMG" );
                            taf = taf.replace( /PROB/g, "<br/>&nbsp;&nbsp;PROB" );
                            text = text + spancol+"TAF: </span>" + taf;
                        }
                        else
                            text = text + spancol+"METAR: </span>" + feature.attributes.rawOb;
                        // Add raw TAF from METAR data
                        if( feature.attributes.rawTaf != undefined ){
                            var taf = feature.attributes.rawTaf.replace( "FROM", "<br/>&nbsp;&nbsp;FROM" );
                            taf = taf.replace( /FM0/g, "<br/>&nbsp;&nbsp;FM0" );
                            taf = taf.replace( /FM1/g, "<br/>&nbsp;&nbsp;FM1" );
                            taf = taf.replace( /FM2/g, "<br/>&nbsp;&nbsp;FM2" );
                            taf = taf.replace( /FM3/g, "<br/>&nbsp;&nbsp;FM3" );
                            taf = taf.replace( /TEMPO/g, "<br/>&nbsp;&nbsp;TEMPO" );
                            taf = taf.replace( /BECMG/g, "<br/>&nbsp;&nbsp;BECMG" );
                            taf = taf.replace( /PROB/g, "<br/>&nbsp;&nbsp;PROB" );
                            text = text + "<hr style='margin:1px 0 1px 0'/>"+spancol+"TAF: </span>" + taf;
                        }
                        text = text + "</div>";
                        var lines = text.match(/<br\/>/g);
                        lines = (lines == null? 0: lines.length)+1;
                        var extra = 0;
                        if( !self.decoded )
                            if( feature.attributes.rawTAF != undefined ){
                                extra = Math.floor(feature.attributes.rawTAF.length/35)+1;
                            } else {
                                extra = Math.floor(feature.attributes.rawOb.length/35)+1;
                            }
                        var rules = text.match(/<hr /g);
                        rules = (rules == null? 0: rules.length);
                        var height = 12*(1 + lines + extra + rules);
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size( 340, height ),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        },
                        "rendererOptions": {
                            "yOrdering": true
                        }
                });
            },

        "Taf":
            function Taf( options ){
                var self = this;
                this.server = AWC_OpenLayers.Library.getServer();;
                this.decoded = false;
                this.metric = false;
                this.plottype = "model";
                this.scale = 1;
                this.proto_opts = {
                    "fore": 0,
                    "filter": 'prior',
                    "density": 0,
                    "metar": false,
                    "tempo": false
                };
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.plottype != undefined )
                        this.plottype =  options.plottype;
                    if( options.date != undefined )
                        this.proto_opts['date'] =  options.date;
                    if( options.fore != undefined )
                        this.proto_opts['fore'] =  options.fore;
                    if( options.scale != undefined )
                        this.scale =  options.scale;
                    if( options.filter != undefined )
                        this.proto_opts['filter'] =  options.filter;
                    if( options.density != undefined )
                        this.proto_opts['density'] =  options.density;
                    if( options.metar != undefined )
                        this.proto_opts['metar'] =  options.metar;
                    if( options.tempo != undefined )
                        this.proto_opts['tempo'] = options.tempo;
                    if( options.decoded != undefined )
                        this.decoded =  options.decoded;
                    if( options.metric != undefined ){
                        AWC_OpenLayers.Library.metric = options.metric;
                        this.metric =  options.metric;
                    }
                }
                this.setPlotType = function( value ){ this.plottype = value; };
                this.getPlotType = function( value ){ return this.plottype; };
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.getDate = function(){ return this.proto_opts['date']; };
                this.setFore = function( value ){ this.proto_opts['fore'] = value; };
                this.getFore = function(){ return this.proto_opts['fore']; };
                this.setScale = function( value ){ this.scale = value; };
                this.getScale = function(){ return this.scale; };
                this.setDensity = function( value ){ this.proto_opts['density'] = value; };
                this.getDensity = function( value ){ return this.proto_opts['density']; };
                this.setTempo = function( value ){ this.proto_opts['tempo'] = value; };
                this.getTempo = function( value ){ return this.proto_opts['tempo']; };
                this.setMetar = function( value ){ this.proto_opts['metar'] = value; };
                this.getMetar = function( value ){ return this.proto_opts['metar']; };
                this.setDecoded = function( value ){ this.decoded = value; };
                this.getDecoded = function( value ){ return this.decoded; };
                this.setMetric =
                    function( value ){
                        AWC_OpenLayers.Library.metric = value;
                        this.metric = value;
                    };
                this.getMetric = function( value ){ return this.metric; };
                this.redraw = function(){ this.layer.redraw(); };

                var eproj = new OpenLayers.Projection("EPSG:4326");
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/TafJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/TafJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var context = {
                    "getIconSize":
                        function(feature){
                            var vars = self.plottype.split(",");
                            var size;
                            size = 80*self.scale;
                            if( vars.length == 1 && self.plottype != "" )
                                size = 30*self.scale;
                            if( self.plottype == "model" ||
                                    self.plottype == "cover" ||
                                    self.plottype == "wind" ||
                                    self.plottype == "cat" )
                                size = 80*self.scale;
                            if( self.plottype == "wx" )
                                size = 20*self.scale;
                            return size;
                        },
                    "getIcon":
                        function(feature){
                            var params = "scale=" + self.scale + "&";
                            var url = self.server + '/gis/scripts';
                            var vars = self.plottype.split(",");
                            if( vars.length > 1 ){
                                var cover = false;
                                for( var i = 0; i < vars.length; i++ ){
                                    if(( vars[i] == "id" ) &&
                                            feature.attributes.id != undefined )
                                        params = params + "id=" +
                                            feature.attributes.id + "&";
                                    if( vars[i] == "temp" &&
                                            feature.attributes.temp != undefined )
                                        params = params + "temp=" +
                                            AWC_OpenLayers.Library.outTemp(feature.attributes.temp) + "&";
                                    if( vars[i] == "dew" &&
                                            feature.attributes.dewp != undefined )
                                        params = params + "dewp=" +
                                            AWC_OpenLayers.Library.outTemp(feature.attributes.dewp) + "&";
                                    if( vars[i] == "alt"  &&
                                            feature.attributes.altim != undefined )
                                        params = params + "altim=" +
                                            AWC_OpenLayers.Library.outAltim(feature.attributes.altim) + "&";
                                    if( vars[i] == "cover" ){
                                        if( feature.attributes.cover != undefined ){
                                            params = params + "cover=" +
                                                feature.attributes.cover + "&";
                                            if( feature.attributes.fltcat != undefined )
                                                params = params + "fltcat=" + feature.attributes.fltcat + "&";
                                        }
                                        cover = true;
                                    }
                                    if( vars[i] == "ceil" &&
                                            feature.attributes.ceil != undefined )
                                        params = params + "ceil=" +
                                            feature.attributes.ceil + "&";
                                    if( vars[i] == "wind" ){
                                        if( feature.attributes.wspd != undefined )
                                            params = params + "wspd=" +
                                                feature.attributes.wspd + "&";
                                        if( feature.attributes.wdir != undefined )
                                            params = params + "wdir=" + feature.attributes.wdir + "&";
                                    }
                                    if( vars[i] == "wgst" ){
                                        if( feature.attributes.wgst != undefined )
                                            params = params + "wgst=" + feature.attributes.wgst + "&";
                                    }
                                    if( vars[i] == "vis" &&
                                            feature.attributes.visib != undefined )
                                        params = params + "visib=" +
                                            AWC_OpenLayers.Library.outVisib(feature.attributes.visib) + "&";
                                    if( vars[i] == "wx" &&
                                            feature.attributes.wx != undefined ){
                                        var wx = feature.attributes.wx.replace( "+", "%2B" );
                                        params = params + "wx=" + wx + "&";
                                    }
                                }
                                if( !cover ) params = params + "cover=S&";
                                return url+'/stationicon.php?'+params;
                            }
                            if( self.plottype == "" ){
                                return url+'/stationicon.php?cover=S';
                            }
                            else if( self.plottype == "model" ){
                                if( feature.attributes.id != undefined )
                                    params = params + "id=" + feature.attributes.id + "&";
                                if( feature.attributes.temp != undefined )
                                    params = params + "temp=" +
                                        AWC_OpenLayers.Library.outTemp(feature.attributes.temp) + "&";
                                if( feature.attributes.dewp != undefined )
                                    params = params + "dewp=" +
                                        AWC_OpenLayers.Library.outTemp(feature.attributes.dewp) + "&";
                                if( feature.attributes.altim != undefined ){
                                    var altim = feature.attributes.altim;
                                    altim = Math.round(altim*2992/1013.25)%1000;
                                    altim = altim.toString();
                                    if( altim.length == 1 ) altim = '00'+altim;
                                    else if( altim.length == 2 ) altim = '0'+altim;
                                    params = params + "altim=" + altim + "&";
                                }
                                if( feature.attributes.cover != undefined )
                                    params = params + "cover=" + feature.attributes.cover + "&";
                                else
                                    params = params + "cover=S&";
                                if( feature.attributes.wspd != undefined )
                                    params = params + "wspd=" + feature.attributes.wspd + "&";
                                if( feature.attributes.wgst != undefined )
                                    params = params + "wgst=" + feature.attributes.wgst + "&";
                                if( feature.attributes.wdir != undefined )
                                    params = params + "wdir=" + feature.attributes.wdir + "&";
                                if( feature.attributes.visib != undefined )
                                    params = params + "visib=" +
                                        AWC_OpenLayers.Library.outVisib(feature.attributes.visib) + "&";
                                if( feature.attributes.ceil != undefined )
                                    params = params + "ceil=" + Math.round(feature.attributes.ceil) + "&";
                                if( feature.attributes.wx != undefined ){
                                    var wx = feature.attributes.wx.replace( "+", "%2B" );
                                    params = params + "wx=" + wx + "&";
                                }
                                if( feature.attributes.fltcat != undefined )
                                    params = params + "fltcat=" + feature.attributes.fltcat + "&";
                                return url+'/stationicon.php?'+params;
                            }
                            else if( self.plottype == "vis" ){
                                params = params + "text=" +
                                    AWC_OpenLayers.Library.outVisib(feature.attributes.visib) + "&";
                                return url+'/txticon.php?'+params;
                            }
                            else if( self.plottype == "ceil" ){
                                if( feature.attributes.ceil != undefined ){
                                    params = params + "text=" + Math.round(feature.attributes.ceil) + "&";
                                    return url+'/txticon.php?'+params;
                                }
                            }
                            else if( self.plottype == "cover" ){
                                if( feature.attributes.fltcat != undefined )
                                    params = params + "fltcat=" + feature.attributes.fltcat + "&";
                                if( feature.attributes.cover != undefined ){
                                    params = params + "cover=" + feature.attributes.cover + "&";
                                    return url+'/stationicon.php?'+params;
                                }
                                else
                                    return url+'/stationicon.php?cover=S';
                            }
                            else if( self.plottype == "wind" ){
                                params = "cover=S&";
                                if( feature.attributes.wspd != undefined )
                                    params = params + "wspd=" + feature.attributes.wspd + "&";
                                if( feature.attributes.wdir != undefined )
                                    params = params + "wdir=" + feature.attributes.wdir + "&";
                                if( feature.attributes.wgst != undefined )
                                    params = params + "wgst=" + feature.attributes.wgst + "&";
                                return url+'/stationicon.php?'+params;
                            }
                            else if( self.plottype == "wspd" ){
                                if( feature.attributes.wspd != undefined )
                                    params = "text=" + Math.round(feature.attributes.wspd) + "&";
                                else
                                    params = "text=-";

                                return url+'/txticon.php?'+params;
                            }
                            else if( self.plottype == "wgst" ){
                                if( feature.attributes.wgst != undefined )
                                    params = "text=" + Math.round(feature.attributes.wgst) + "&";
                                else
                                    params = "text=-";
                                return url+'/txticon.php?'+params;
                            }
                            else if( self.plottype == "cat" ){
                                if( feature.attributes.fltcat != undefined )
                                    params = "cover=OVC&fltcat=" + feature.attributes.fltcat + "&";
                                else
                                    params = "cover=S";

                                return url+'/stationicon.php?'+params;
                            }
                            else if( self.plottype == "wx" ){
                                if( feature.attributes.wx != undefined ){
                                    var wx = feature.attributes.wx.replace( "+", "%2B" );
                                    params = params + "code=" + feature.attributes.wx + "&";
                                }
                                return url+'/wxicon.php?'+params;
                            }
                            return url+'/txticon.php?text=-';

                        }
                };
                var style = new OpenLayers.Style({
                        "externalGraphic": OpenLayers.Util.getImagesLocation() + "blank.gif",
                        "graphicZIndex":10,
                        "backgroundGraphic": "${getIcon}",
                        "backgroundWidth": "${getIconSize}",
                        "backgroundHeight": "${getIconSize}",
                        "backgroundGraphicZIndex":1,
                        "pointRadius": 8,
                        "opacity": 1
                        }, {
                        "context": context
                        }
                        );
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector( "Taf", {
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": new OpenLayers.StyleMap(style),
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white; font-weight: bold'>" +
                        feature.attributes.id + " ["+feature.attributes.site+
                        "]</div>";
                        if( feature.attributes.rawOb ){
                        text = text + spancol + "METAR: </span>" + feature.attributes.rawOb + "<hr style='margin:1px 0 1px 0'/>";
                        }
                        if( self.decoded ){
                        if( feature.attributes.fcstType != undefined )
                        text = text + spancol+"Type: </span>" + feature.attributes.fcstType + "<br/>";
                        if( feature.attributes.validTime != undefined )
                            text = text + spancol+"Valid Time: </span>" + feature.attributes.validTime + "<br/>";
                        else
                            text = text + "No report";
                        if( feature.attributes.visib != undefined )
                            text = text + spancol+"Visibility: </span>" +
                                AWC_OpenLayers.Library.outVisib(feature.attributes.visib) + " " +
                                AWC_OpenLayers.Library.outVisibUnits() + "<br/>";
                        if( feature.attributes.ceil != undefined )
                            text = text + spancol+"Ceiling: </span>" + feature.attributes.ceil + "00ft<br/>";
                        if( feature.attributes.cover != undefined )
                            text = text + spancol+"Cover: </span>" + feature.attributes.cover + "<br/>";
                        if( feature.attributes.wdir != undefined ){
                            if( feature.attributes.wdir == 0 && feature.attributes.wspd == 0 )
                                text = text + spancol+"Winds: </span>calm";
                            else if( feature.attributes.wdir == 0 && feature.attributes.wspd > 0 )
                                text = text + spancol+"Winds: </span>Variable at " +
                                    feature.attributes.wspd + " knt";
                            else
                                text = text + spancol+"Winds: </span>" + feature.attributes.wdir +
                                    " at " + feature.attributes.wspd + " knt";
                            if( feature.attributes.wgst != undefined )
                                text = text + " gusts to " + feature.attributes.wgst + " knt";
                            text = text + "<br/>";
                        }
                        if( feature.attributes.wx != undefined )
                            text = text + spancol+"Weather: </span>" + feature.attributes.wx + "<br/>";
                        if( feature.attributes.fltcat != undefined )
                            text = text + spancol+"Flight Cat: </span>" + feature.attributes.fltcat;
                        } else {
                            var taf = feature.attributes.rawTAF.replace( "FROM", "<br/>&nbsp;&nbsp;FROM" );
                            taf = taf.replace( /FM0/g, "<br/>&nbsp;&nbsp;FM0" );
                            taf = taf.replace( /FM1/g, "<br/>&nbsp;&nbsp;FM1" );
                            taf = taf.replace( /FM2/g, "<br/>&nbsp;&nbsp;FM2" );
                            taf = taf.replace( /FM3/g, "<br/>&nbsp;&nbsp;FM3" );
                            taf = taf.replace( /TEMPO/g, "<br/>&nbsp;&nbsp;TEMPO" );
                            taf = taf.replace( /BECMG/g, "<br/>&nbsp;&nbsp;BECMG" );
                            taf = taf.replace( /PROB/g, "<br/>&nbsp;&nbsp;PROB" );
                            text = text + spancol+"TAF: </span>"+taf;
                        }
                        var lines = text.match(/<br\/>/g);
                        lines = (lines == null? 3: lines.length);
                        var rules = text.match(/<hr\/>/g);
                        rules = (rules == null? 0: rules.length);
                        var height = 14*(lines + 4 + rules);

                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size( 360, height ),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        },
                        "rendererOptions": {
                            "yOrdering": true
                        }
                });
            },

        "Airep":
            function Airep(options){
                var self = this;
                this.proto_opts = {type: "all"};
                this.scale = 1;
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.age != undefined )
                        this.proto_opts['age'] = options.age;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                    if( options.level != undefined )
                        this.proto_opts['level'] = options.level;
                    if( options.layer != undefined )
                        this.proto_opts['layer'] = options.layer;
                    if( options.scale != undefined )
                        this.scale = options.scale;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.getTop = function(){return this.proto_opts['top']};
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.getBottom = function(){return this.proto_opts['bottom']};
                this.setLevel = function(value){this.proto_opts['level'] = value;};
                this.getLevel = function(){return this.proto_opts['level']};
                this.setAge = function(value){this.proto_opts['age'] = value;};
                this.getAge = function(){return this.proto_opts['age']};
                this.setInten = function(value){this.proto_opts['inten'] = value;};
                this.getInten = function(){return this.proto_opts['inten']};
                this.setScale = function(value){this.scale = value;};
                this.getScale = function(){return this.scale};
                this.redraw = function(){this.layer.redraw()};
                var context = {
                    "getIconSize":
                        function(feature){
                            return 20*self.scale;
                        },
                    "getColor":
                        function(feature){
                            var icon;
                            var color = "000000";
                            if( feature.attributes.airepType == "Urgent PIREP" )
                                color = "aa0000";
                            return color;
                        },
                    "getIcon":
                        function(feature){
                            var icon;
                            var dir = 45;
                            var color = "000000";
                            if( feature.attributes.airepType == "Urgent PIREP" )
                                color = "aa0000";
                            icon = "/gis/scripts/wxicon.php?code=PLANE&dir="+dir+"&color="+color;
                            icon = icon + "&scale=" + self.scale;
                            return icon;
                        },
                    "getLabel":
                        function(feature){
                            if( feature.attributes.airepType == "Urgent PIREP" )
                                return "UUA "+feature.attributes.fltlvl;
                            return ""+feature.attributes.fltlvl;
                        }
                };
                var style = new OpenLayers.Style({
                        "externalGraphic": OpenLayers.Util.getImagesLocation() + "blank.gif",
                        "graphicZIndex":10,
                        "backgroundGraphic": "${getIcon}",
                        "backgroundWidth": "${getIconSize}",
                        "backgroundHeight": "${getIconSize}",
                        "backgroundGraphicZIndex":1,
                        "label": "${getLabel}",
                        "fontSize": "10px",
                        "fontColor": "#${getColor}",
                        "labelAlign": "cc",
                        "labelXOffset": "0",
                        "labelYOffset": "-16",
                        "labelOutlineColor": "white",
                        "labelOutlineWidth": 2,
                        "pointRadius": 8,
                        "opacity": 1
                        }, {
                        "context": context
                        }
                        );
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/AirepJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/AirepJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("AirepTurb",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": new OpenLayers.StyleMap(style),
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white; font-weight: bold'>" + feature.attributes.airepType + " " +
                        feature.attributes.acType + "</div>";
                        var date = new Date( feature.attributes.obsTime);
                        text = text + spancol+"Obs Time: </span>"+feature.attributes.obsTime+"<br/>";
                        text = text + "<hr style='margin:1px 0 1px 0'/>"+spancol+feature.attributes.airepType+": </span>"+feature.attributes.rawOb+"<br/></div>";
                        var lines = text.match(/<br\/>/g);
                        lines = (lines == null? 0: lines.length);
                        var extra = Math.floor(feature.attributes.rawOb.length/35);
                        var rules = text.match(/<hr\/>/g);
                        rules = (rules == null? 0: rules.length);
                        height = 14*(1 + lines + extra + rules);

                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size(300,height),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        },
                        "rendererOptions": {
                            "yOrdering": true
                        }
                });
            },
        "AirepTurb":
            function AirepTurb(options){
                var self = this;
                this.proto_opts = {type: "turb"};
                this.scale = 1;
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.noneg != undefined )
                        this.proto_opts['noneg'] = 1;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.age != undefined )
                        this.proto_opts['age'] = options.age;
                    if( options.inten != undefined )
                        this.proto_opts['inten'] = options.inten;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                    if( options.level != undefined )
                        this.proto_opts['level'] = options.level;
                    if( options.layer != undefined )
                        this.proto_opts['layer'] = options.layer;
                    if( options.scale != undefined )
                        this.scale = options.scale;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.getTop = function(){return this.proto_opts['top']};
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.getBottom = function(){return this.proto_opts['bottom']};
                this.setLevel = function(value){this.proto_opts['level'] = value;};
                this.getLevel = function(){return this.proto_opts['level']};
                this.setAge = function(value){this.proto_opts['age'] = value;};
                this.getAge = function(){return this.proto_opts['age']};
                this.setInten = function(value){this.proto_opts['inten'] = value;};
                this.getInten = function(){return this.proto_opts['inten']};
                this.setNoNeg = function(value){this.proto_opts['noneg'] = value;};
                this.getNoNeg = function(){return this.proto_opts['noneg']};
                this.setScale = function(value){this.scale = value;};
                this.getScale = function(){return this.scale};
                this.redraw = function(){this.layer.redraw()};
                var context = {
                    "getIconSize":
                        function(feature){
                            if( feature.attributes.tbType1 == "LLWS" ||
                                    feature.attributes.tbType1 == "MWAVE" )
                                return 30*self.scale;
                            else
                                return 20*self.scale;
                        },
                    "getColor":
                        function(feature){
                            var icon;
                            var color = "ff8800";
                            if( feature.attributes.tbInt1 == "NEG" )
                                color = "0000ff";
                            else if( feature.attributes.tbType1 == "LLWS" )
                                color = "aa0000";
                            else if( feature.attributes.tbType1 == "MWAVE" )
                                color = "cc8800";
                            else if( feature.attributes.tbInt1 == "SMTH-LGT" )
                                color = "008800";
                            else if( feature.attributes.tbInt1 == "LGT" )
                                color = "008800";
                            else if( feature.attributes.tbInt1 == "LGT-MOD" )
                                color = "cc8800";
                            else if( feature.attributes.tbInt1 == "MOD" )
                                color = "cc8800";
                            else if( feature.attributes.tbInt1 == "MOD-SEV" )
                                color = "aa0000";
                            else if( feature.attributes.tbInt1 == "SEV" )
                                color = "aa0000";
                            else if( feature.attributes.tbInt1 == "SEV-EXTM" )
                                color = "cc00cc";
                            else if( feature.attributes.tbInt1 == "EXTM" )
                                color = "cc00cc";
                            else
                                color = "008800";
                            if( feature.attributes.airepType == "Urgent PIREP" )
                                color = "aa0000";
                            return color;
                        },
                    "getIcon":
                        function(feature){
                            var icon;
                            var color = "ff8800";
                            if( feature.attributes.airepType == "Urgent PIREP" )
                                color = "aa0000";
                            if( feature.attributes.tbInt1 == "NEG" )
                                icon = self.server+'/gis/scripts/wxicon.php?code=TUR-N&color=0000ff';
                            else if( feature.attributes.tbType1 == "MWAVE" )
                                icon = self.server+'/gis/scripts/txticon.php?text=MWAV&color=ff8800';
                            else if( feature.attributes.tbType1 == "LLWS" )
                                icon = self.server+'/gis/scripts/txticon.php?text=LLWS&color=aa0000';
                            else if( feature.attributes.tbInt1 == "SMTH-LGT" )
                                icon = self.server+'/gis/scripts/wxicon.php?code=TUR-TL&color=00aa00';
                            else if( feature.attributes.tbInt1 == "LGT" )
                                icon = self.server+'/gis/scripts/wxicon.php?code=TUR-L&color=00aa00';
                            else if( feature.attributes.tbInt1 == "LGT-MOD" )
                                icon = self.server+'/gis/scripts/wxicon.php?code=TUR-LM&color=ff8800';
                            else if( feature.attributes.tbInt1 == "MOD" )
                                icon = self.server+'/gis/scripts/wxicon.php?code=TUR-M&color=ff8800';
                            else if( feature.attributes.tbInt1 == "MOD-SEV" )
                                icon = self.server+'/gis/scripts/wxicon.php?code=TUR-MS&color=aa0000';
                            else if( feature.attributes.tbInt1 == "SEV" )
                                icon = self.server+'/gis/scripts/wxicon.php?code=TUR-S&color=aa0000';
                            else if( feature.attributes.tbInt1 == "SEV-EXTM" )
                                icon = self.server+'/gis/scripts/wxicon.php?code=TUR-S&color=cc00cc';
                            else if( feature.attributes.tbInt1 == "EXTM" )
                                icon = self.server+'/gis/scripts/wxicon.php?code=TUR-X&color=cc00cc';
                            else
                                icon = self.server+'/gis/scripts/wxicon.php?code=TUR-L&color=00aa00';
                            icon = icon + "&scale=" + self.scale;
                            return icon;
                        },
                    "getLabel":
                        function(feature){
                            if( feature.attributes.airepType == "Urgent PIREP" )
                                return "UUA "+feature.attributes.fltlvl;
                            return ""+feature.attributes.fltlvl;
                        }
                };
                var style = new OpenLayers.Style({
                        "externalGraphic": OpenLayers.Util.getImagesLocation() + "blank.gif",
                        "graphicZIndex":10,
                        "backgroundGraphic": "${getIcon}",
                        "backgroundWidth": "${getIconSize}",
                        "backgroundHeight": "${getIconSize}",
                        "backgroundGraphicZIndex":1,
                        "label": "${getLabel}",
                        "fontSize": "10px",
                        "fontColor": "#${getColor}",
                        "labelAlign": "cc",
                        "labelXOffset": "0",
                        "labelYOffset": "-16",
                        "labelOutlineColor": "white",
                        "labelOutlineWidth": 2,
                        "pointRadius": 8,
                        "opacity": 1
                        }, {
                        "context": context
                        }
                        );
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/AirepJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/AirepJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("AirepTurb",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": new OpenLayers.StyleMap(style),
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white; font-weight: bold'>" + feature.attributes.airepType + " " +
                        feature.attributes.acType + "</div>";
                        var date = new Date( feature.attributes.obsTime);
                        text = text + spancol+"Obs Time: </span>"+feature.attributes.obsTime+"<br/>";
                        text = text + spancol+"Hazard: </span>Turbulence<br/>";
                        text = text + spancol+"Intensity: </span>"+feature.attributes.tbInt1+"<br/>";
                        if( feature.attributes.tbType1 != undefined )
                        text = text + spancol+"Type: </span>"+feature.attributes.tbType1+"<br/>";
                        if( feature.attributes.tbFreq1 != undefined )
                            text = text + spancol+"Freqency: </span>"+feature.attributes.tbFreq1+"<br/>";
                        if( feature.attributes.fltlvl != undefined )
                            text = text + spancol+"Flight level: </span>"+feature.attributes.fltlvl+
                                "<br/>";
                        text = text + "<hr style='margin:1px 0 1px 0'/>"+spancol+feature.attributes.airepType+": </span>"+feature.attributes.rawOb+"<br/></div>";
                        var lines = text.match(/<br\/>/g);
                        lines = (lines == null? 0: lines.length);
                        var extra = Math.floor(feature.attributes.rawOb.length/35);
                        var rules = text.match(/<hr\/>/g);
                        rules = (rules == null? 0: rules.length);
                        height = 14*(1 + lines + extra + rules);

                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size(300,height),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        },
                        "rendererOptions": {
                            "yOrdering": true
                        }
                });
            },
        "AirepIcing":
            function AirepIcing(options){
                var self = this;
                this.proto_opts = {type: "icing"};
                this.scale = 1;
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.noneg != undefined )
                        this.proto_opts['noneg'] = 1;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.age != undefined )
                        this.proto_opts['age'] = options.age;
                    if( options.inten != undefined )
                        this.proto_opts['inten'] = options.inten;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                    if( options.level != undefined )
                        this.proto_opts['level'] = options.level;
                    if( options.layer != undefined )
                        this.proto_opts['layer'] = options.layer;
                    if( options.scale != undefined )
                        this.scale = options.scale;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.getTop = function(){return this.proto_opts['top'];};
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.getBottom = function(){return this.proto_opts['bottom'];};
                this.setLevel = function(value){this.proto_opts['level'] = value;};
                this.getLevel = function(){return this.proto_opts['level'];};
                this.setAge = function(value){this.proto_opts['age'] = value;};
                this.getAge = function(){return this.proto_opts['age'];};
                this.setInten = function(value){this.proto_opts['inten'] = value;};
                this.getInten = function(){return this.proto_opts['inten']};
                this.setNoNeg = function(value){this.proto_opts['noneg'] = value;};
                this.getNoNeg = function(){return this.proto_opts['noneg']};
                this.setScale = function(value){this.scale = value;};
                this.getScale = function(){return this.scale};
                this.redraw = function(){this.layer.redraw()};
                var context = {
                    "getIconSize":
                        function(feature){
                            return 20*self.scale;
                        },
                    "getColor":
                        function(feature){
                            var icon;
                            var color = "ff8800";
                            if( feature.attributes.icgInt1 == "NEG" )
                                color = "0000ff";
                            else if( feature.attributes.icgInt1 == "TRC" )
                                color = "008800";
                            else if( feature.attributes.icgInt1 == "TRC-LGT" )
                                color = "008800";
                            else if( feature.attributes.icgInt1 == "LGT" )
                                color = "008800";
                            else if( feature.attributes.icgInt1 == "LGT-MOD" )
                                color = "cc8800";
                            else if( feature.attributes.icgInt1 == "MOD" )
                                color = "cc8800";
                            else if( feature.attributes.icgInt1 == "MOD-SEV" )
                                color = "aa0000";
                            else if( feature.attributes.icgInt1 == "SEV" )
                                color = "aa0000";
                            else
                                color = "008800";
                            if( feature.attributes.airepType == "Urgent PIREP" )
                                color = "aa0000";
                            return color;
                        },
                    "getIcon":
                        function(feature){
                            var icon;
                            var color = "0000ff";
                            if( feature.attributes.airepType == "Urgent PIREP" )
                                color = "aa0000";
                            if( feature.attributes.icgInt1 == "NEG" )
                                icon = self.server+'/gis/scripts/wxicon.php?code=ICE-N&color=0000ff';
                            else if( feature.attributes.icgInt1 == "TRC" )
                                icon = self.server+'/gis/scripts/wxicon.php?code=ICE-T&color=00aa00';
                            else if( feature.attributes.icgInt1 == "TRC-LGT" )
                                icon = self.server+'/gis/scripts/wxicon.php?code=ICE-TL&color=00aa00';
                            else if( feature.attributes.icgInt1 == "LGT" )
                                icon = self.server+'/gis/scripts/wxicon.php?code=ICE-L&color=00aa00';
                            else if( feature.attributes.icgInt1 == "LGT-MOD" )
                                icon = self.server+'/gis/scripts/wxicon.php?code=ICE-L&color=ff8800';
                            else if( feature.attributes.icgInt1 == "MOD" )
                                icon = self.server+'/gis/scripts/wxicon.php?code=ICE-M&color=ff8800';
                            else if( feature.attributes.icgInt1 == "MOD-SEV" )
                                icon = self.server+'/gis/scripts/wxicon.php?code=ICE-M&color=aa0000';
                            else if( feature.attributes.icgInt1 == "SEV" )
                                icon = self.server+'/gis/scripts/wxicon.php?code=ICE-S&color=aa0000';
                            else
                                icon = self.server+'/gis/scripts/wxicon.php?code=ICE-L&color=00aa00';
                            icon = icon + "&scale=" + self.scale;
                            return icon;
                        },
                    "getLabel":
                        function(feature){
                            if( feature.attributes.airepType == "Urgent PIREP" )
                                return "UUA";
                            return ""+feature.attributes.fltlvl;
                        }
                };
                var style = new OpenLayers.Style({
                        "externalGraphic": OpenLayers.Util.getImagesLocation() + "blank.gif",
                        "graphicZIndex":10,
                        "backgroundGraphic": "${getIcon}",
                        "backgroundWidth": "${getIconSize}",
                        "backgroundHeight": "${getIconSize}",
                        "backgroundGraphicZIndex":1,
                        "label": "${getLabel}",
                        "fontSize": "10px",
                        "fontColor": "#${getColor}",
                        "labelAlign": "cc",
                        "labelXOffset": "0",
                        "labelYOffset": "-16",
                        "labelOutlineColor": "white",
                        "labelOutlineWidth": 2,
                        "pointRadius": 8,
                        "opacity": 1
                        }, {
                        "context": context
                        }
                        );
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/AirepJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/AirepJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("AirepIcing",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": new OpenLayers.StyleMap(style),
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white; font-weight: bold'>" +
                        feature.attributes.airepType + " " +
                        feature.attributes.acType + "</div>";
                        var date = new Date( feature.attributes.obsTime);
                        text = text + spancol+"Obs Time: </span>"+feature.attributes.obsTime+"<br/>";
                        text = text + spancol+"Hazard: </span>Icing<br/>";
                        text = text + spancol+"Intensity: </span>"+feature.attributes.icgInt1+"<br/>";
                        if( feature.attributes.icgType1 != undefined )
                        text = text + spancol+"Type:</span> "+feature.attributes.icgType1+"<br/>";
                        if( feature.attributes.fltlvl != undefined )
                            text = text + spancol+"Flight level: </span>"+feature.attributes.fltlvl+
                                "<br/>";
                        text = text + "<hr style='margin:1px 0 1px 0'/>"+spancol+feature.attributes.airepType+": </span>"+feature.attributes.rawOb+"<br/></div>";
                        var lines = text.match(/<br\/>/g);
                        lines = (lines == null? 0: lines.length);
                        var extra = Math.floor(feature.attributes.rawOb.length/35);
                        var rules = text.match(/<hr\/>/g);
                        rules = (rules == null? 0: rules.length);
                        height = 14*(1 + lines + extra + rules);
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size(300,height),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        },
                        "rendererOptions": {
                            "yOrdering": true
                        }
                });
            },
        "AirepWeather":
            function AirepWeather(options){
                var self = this;
                this.scale = 1;
                this.proto_opts = {type: "wx"};
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.noneg != undefined )
                        this.proto_opts['noneg'] = 1;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.age != undefined )
                        this.proto_opts['age'] = options.age;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                    if( options.level != undefined )
                        this.proto_opts['level'] = options.level;
                    if( options.layer != undefined )
                        this.proto_opts['layer'] = options.layer;
                    if( options.scale != undefined )
                        this.scale = options.scale;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.setLevel = function(value){this.proto_opts['level'] = value;};
                this.setAge = function(value){this.proto_opts['age'] = value;};
                this.setScale = function(value){this.scale = value;};
                this.getScale = function(){return this.scale};
                this.redraw = function(){this.layer.redraw()};
                var context = {
                    "getIconSize":
                        function(feature){
                            return 80*self.scale;
                        },
                    "getColor":
                        function(feature){
                            var icon;
                            var color = "000000";
                            if( feature.attributes.airepType == "Urgent PIREP" )
                                color = "aa0000";
                            return color;
                        },
                    "getIcon":
                        function(feature){
                            var icon;
                            icon = self.server+'/gis/scripts/stationicon.php?';
                            if( feature.attributes.temp != undefined )
                                icon = icon + "temp="+feature.attributes.temp + "&";
                            if( feature.attributes.wdir != undefined ){
                                icon = icon + "wdir="+feature.attributes.wdir + "&";
                                icon = icon + "wspd="+feature.attributes.wspd + "&";
                            }
                            icon = icon + "fltlvl="+feature.attributes.fltlvl + "&";
                            if( feature.attributes.cloudCvg1 != undefined )
                                icon = icon + "cover="+feature.attributes.cloudCvg1+"&";
                            else
                                icon = icon + "cover=S&";
                            if( feature.attributes.cloudBas1 != undefined )
                                icon = icon + "cbas="+feature.attributes.cloudBas1 + "&";
                            if( feature.attributes.cloudTop1 != undefined )
                                icon = icon + "ctop="+feature.attributes.cloudTop1 + "&";
                            if( feature.attributes.airepType == "Urgent PIREP" )
                                icon = icon + "color=aa0000";
                            icon = icon + "&scale=" + self.scale;
                            return icon;
                        },
                    "getLabel":
                        function(feature){
                            if( feature.attributes.airepType == "Urgent PIREP" )
                                return "UUA";
                            return "";
                        }
                };
                var style = new OpenLayers.Style({
                        "externalGraphic": OpenLayers.Util.getImagesLocation() + "blank.gif",
                        "graphicZIndex":10,
                        "backgroundGraphic": "${getIcon}",
                        "backgroundWidth": "${getIconSize}",
                        "backgroundHeight": "${getIconSize}",
                        "backgroundGraphicZIndex":1,
                        "label": "${getLabel}",
                        "fontSize": "10px",
                        "fontColor": "#${getColor}",
                        "labelAlign": "cc",
                        "labelXOffset": "0",
                        "labelYOffset": "-12",
                        "labelOutlineColor": "white",
                        "labelOutlineWidth": 2,
                        "pointRadius": 8,
                        "opacity": 1
                        }, {
                        "context": context
                        }
                        );
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/AirepJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/AirepJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("AirepWeather",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": new OpenLayers.StyleMap(style),
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white; font-weight: bold'>" +
                        feature.attributes.airepType+" "+
                        feature.attributes.acType + "</div>";
                        text = text + spancol+"Obs Time: </span>"+feature.attributes.obsTime+"<br/>";
                        if( feature.attributes.fltlvl != undefined )
                        text = text + spancol+"Flight level: </span>"+feature.attributes.fltlvl+
                        "<br/>";
                        if( feature.attributes.wdir != undefined )
                        text = text + spancol+"Wind: </span>"+feature.attributes.wdir+" at " +
                            feature.attributes.wspd+"knt<br/>";
                        if( feature.attributes.temp != undefined )
                            text = text + spancol+"Temperature: </span>"+feature.attributes.temp+"&deg;C<br/> ";
                        if( feature.attributes.cloudCvg1 != undefined )
                            text = text + spancol+"Cloud Cover: </span>"+feature.attributes.cloudCvg1+"<br/>";
                        if( feature.attributes.cloudTop1 != undefined )
                            text = text + spancol+"Cloud Top: </span>"+feature.attributes.cloudTop1+"<br/>";
                        if( feature.attributes.cloudBas1 != undefined )
                            text = text + spancol+"Cloud Base: </span>"+feature.attributes.cloudBas1+"<br/>";
                        if( feature.attributes.wxString != undefined )
                            text = text + spancol+"Weather: </span>"+feature.attributes.wxString+"<br/>";
                        text = text + "<hr style='margin:1px 0 1px 0'/>"+spancol+feature.attributes.airepType+": </span>"+feature.attributes.rawOb+"<br/></div>";
                        var lines = text.match(/<br\/>/g);
                        lines = (lines == null? 0: lines.length);
                        var extra = Math.floor(feature.attributes.rawOb.length/35);
                        var rules = text.match(/<hr\/>/g);
                        rules = (rules == null? 0: rules.length);
                        height = 14*(1 + lines + extra + rules);
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size(300,height),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        },
                        "rendererOptions": {
                            "yOrdering": true
                        }
                });
            },
        "Sigmet":
            function Sigmet(options){
                var self = this;
                this.proto_opts = {type: "all"};
                this.heights = false;
                this.opacity = 0.5;
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.type != undefined )
                        this.proto_opts['type'] = options.type;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                    if( options.level != undefined )
                        this.proto_opts['level'] = options.level;
                    if( options.heights != undefined )
                        this.heights = options.heights;
                    if( options.opacity != undefined )
                        this.opacity = options.opacity;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setType = function(value){this.proto_opts['type'] = value;};
                this.getType = function(){return this.proto_opts['type'];};
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.getTop = function(){return this.proto_opts['top'];};
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.getBottom = function(){return this.proto_opts['bottom'];};
                this.setLevel = function(value){this.proto_opts['level'] = value;};
                this.getLevel = function(){return this.proto_opts['level'];};
                this.setHeights = function(value){this.heights = value;};
                this.getHeights = function(){return this.heights;};
                this.setOpacity = function(value){this.opacity = value;};
                this.getOpacity = function(){return this.opacity;};
                this.redraw = function(){ this.layer.redraw(); };
                var context = {
                    "getColor":
                        function(feature){
                            if( feature.attributes.hazard == "TS" )
                                return "#800000";
                            if( feature.attributes.hazard == "TC" )
                                return "#800000";
                            if( feature.attributes.hazard == "ICE" )
                                return "#000080";
                            if( feature.attributes.hazard == "TURB" )
                                return "#A06000";
                            if( feature.attributes.hazard == "VA" )
                                return "#808080";
                            if( feature.attributes.hazard == "IFR" )
                                return "#990099";
                            return "#800000";
                        },
                    "getHighlightColor":
                        function(feature){
                            if( feature.attributes.hazard == "ICE" )
                                return "#8080FF";
                            if( feature.attributes.hazard == "TURB" )
                                return "#FFA000";
                            if( feature.attributes.hazard == "VA" )
                                return "#FFFFFF";
                            if( feature.attributes.hazard == "IFR" )
                                return "#FF80FF";
                            return "#FF8080";
                        },
                    "getLabel":
                        function(feature){
                            var label = "";
                            // 'MTN OBSCN','IFR','TURB','ICE','CONVECTIVE','ASH'
                            if( feature.attributes.hazard == "CONVECTIVE" )
                                label = label + "Conv";
                            else if( feature.attributes.hazard == "MTN OBSCN" )
                                label = label + "MtnOb";
                            else if( feature.attributes.hazard == "TURB" )
                                label = label + "Turb";
                            else if( feature.attributes.hazard == "ICE" )
                                label = label + "Icing";
                            else if( feature.attributes.hazard == "ASH" )
                                label = label + "VA";
                            else if( feature.attributes.hazard == "IFR" )
                                label = label + "IFR";
                            else 
                                label = label + "--";
                            if( self.heights ){
                                if( feature.attributes.altitudeLow1 != undefined )
                                    label = label + "\n" + feature.attributes.altitudeLow1/100;
                                if( feature.attributes.altitudeHi1 != undefined &&
                                        feature.attributes.altitudeHi2 != feature.attributes.altitudeHi1 )
                                    label = label + "\n&gt;" + feature.attributes.altitudeHi1/100;

                                else if( feature.attributes.altitudeHi2 != undefined )
                                    label = label + " - " + feature.attributes.altitudeHi2/100;
                            }
                            return label;
                        },
                    "getOpacity":
                        function(feature){
                            return self.opacity;
                        }
                };
                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor": "${getColor}",
                            "fillOpacity": "${getOpacity}",
                            "strokeColor": "#800000",
                            "strokeOpacity": 1,
                            "strokeWidth": 2,
                            "label": "${getLabel}",
                            "fontSize": "10px",
                            "fontColor": "#800000",
                            "labelOutlineColor": "white",
                            "labelOutlineWidth": 3,
                            "pointRadius": 5
                            }, {
                            "context": context }),
                        "select": new OpenLayers.Style({
                            "fillColor": "${getHighlightColor}",
                            "strokeColor": "#FF8080"
                            }, {
                            "context": context })
                        });
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/SigmetJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/SigmetJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("Sigmet",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": stylemap,
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var rawtext = feature.attributes.rawAirSigmet;
                        rawtext = rawtext.replace(/\n/g, "<br/>")
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white;font-weight:bold'>" +
                        feature.attributes.hazard + " SIGMET"  + "</div>";
                        text = text + spancol+"Center: </span>" + feature.attributes.icaoId + "<br/>";
                        text = text + spancol+"Begins: </span>" + feature.attributes.validTimeFrom + "<br/>";
                        text = text + spancol+"Ends: </span>" + feature.attributes.validTimeTo + "<br/>";
                        if( feature.attributes.altitudeHi1 != undefined &&
                            feature.attributes.altitudeHi2 != feature.attributes.altitudeHi1 )
                            text = text + spancol+"Top above: </span>" + feature.attributes.altitudeHi1 + "<br/>";

                        else if( feature.attributes.altitudeHi2 != undefined )
                            text = text + spancol+"Top: </span>" + feature.attributes.altitudeHi2 + " ft<br/>";
                        if( feature.attributes.altitudeLow1 != undefined )
                            text = text + spancol+"Base: </span>" + feature.attributes.altitudeLow1 + " ft<br/>";
                        text = text + "<hr style='margin:1px 0 1px 0'/>" + rawtext + "</div>";
                        var lines = text.match(/<br\/>/g);
                        lines = (lines == null? 3: lines.length);
                        var rules = text.match(/<hr\/>/g);
                        rules = (rules == null? 0: rules.length);
                        height = 16*(lines + 1 + rules);
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size( 360, height ),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "Isigmet":
            function Isigmet(options){
                var self = this;
                this.proto_opts = {type: "all"};
                this.heights = false;
                this.opacity = 0.5;
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.type != undefined )
                        this.proto_opts['type'] = options.type;
                    if( options.level != undefined )
                        this.proto_opts['level'] = options.level;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                    if( options.heights != undefined )
                        this.heights = options.heights;
                    if( options.opacity != undefined )
                        this.opacity = options.opacity;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setType = function(value){this.proto_opts['type'] = value;};
                this.setLevel = function(value){this.proto_opts['level'] = value;};
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.setHeights = function(value){this.heights = value;};
                this.setOpacity = function(value){this.opacity = value;};
                this.redraw = function(){ this.layer.redraw(); };
                var context = {
                    "getColor":
                        function(feature){
                            if( feature.attributes.hazard == "TS" )
                                return "#800000";
                            if( feature.attributes.hazard == "TC" )
                                return "#800000";
                            if( feature.attributes.hazard == "ICE" )
                                return "#000080";
                            if( feature.attributes.hazard == "TURB" )
                                return "#A06000";
                            if( feature.attributes.hazard == "VA" )
                                return "#808080";
                            return "#800000";
                        },
                    "getHighlightColor":
                        function(feature){
                            if( feature.attributes.hazard == "ICE" )
                                return "#8080FF";
                            if( feature.attributes.hazard == "TURB" )
                                return "#FFA000";
                            if( feature.attributes.hazard == "VA" )
                                return "#FFFFFF";
                            return "#FF8080";
                        },
                    "getLabel":
                        function(feature){
                            var label = "";
                            if( feature.attributes.hazard == "ICE" )
                                label = label + "Ice";
                            else if( feature.attributes.hazard == "TURB" )
                                label = label + "Turb";
                            else if( feature.attributes.hazard == "TC" )
                                label = label + "Trop";
                            else if( feature.attributes.hazard == "DS" )
                                label = label + "Dust";
                            else
                                label = label + feature.attributes.hazard;
                            if( self.heights ){
                                if( feature.attributes.base != undefined && 
                                        feature.attributes.top != undefined )
                                    label = label + " " + Math.round(feature.attributes.base/100) + "-" +
                                        Math.round(feature.attributes.top/100);
                                else if( feature.attributes.top != undefined )
                                    label = label + " <" + Math.round(feature.attributes.top/100);
                            }
                            return label;
                        },
                    "getRadius":
                        function(feature){
                            if( feature.attributes.geom == "UNK" )
                                return 16;
                            return 8;
                        },
                    "getOpacity":
                        function(feature){
                            if( feature.attributes.geom == "UNK" )
                                return 0.15;
                            return self.opacity;
                        }
                };
                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor": "${getColor}",
                            "fillOpacity": "${getOpacity}",
                            "strokeColor": "#C00000",
                            "strokeOpacity": 1,
                            "strokeWidth": 2,
                            "label": "${getLabel}",
                            "fontSize": "10px",
                            "fontColor": "#C00000",
                            "labelOutlineColor": "white",
                            "labelOutlineWidth": 3,
                            "pointRadius": "${getRadius}"
                            }, {
                            "context": context
                            }
                            ),
                        "select": new OpenLayers.Style({
                            "fillColor": "${getHighlightColor}",
                            "strokeColor": "#FF8080"
                            }, {
                            "context": context
                            }
                            )
                }
                );
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/IsigmetJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/IsigmetJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("IntlSigmet",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": stylemap,
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var rawtext = feature.attributes.rawSigmet;
                        rawtext = rawtext.replace(/\n/g, "<br/>")
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white;font-weight:bold'>" +
                        feature.attributes.hazard + " SIGMET"  + "</div>";
                        text = text + spancol+"FIR Id: </span>" + feature.attributes.firId + "<br/>";
                        text = text + spancol+"FIR Name: </span>" + feature.attributes.firName + "<br/>";
                        text = text + spancol+"Hazard: </span>" + feature.attributes.hazard + " - " + feature.attributes.qualifier + "<br/>";
                        text = text + spancol+"Begins: </span>" + feature.attributes.validTimeFrom + "<br/>";
                        text = text + spancol+"Ends: </span>" + feature.attributes.validTimeTo + "<br/>";
                        if( feature.attributes.top != undefined )
                            text = text + spancol+"Top: </span>" + feature.attributes.top + " ft<br/>";
                        if( feature.attributes.base != undefined )
                            text = text + spancol+"Base: </span>" + feature.attributes.base + " ft<br/>";
                        if( feature.attributes.geom == "UNK" )
                            text = text + spancol+"Region: </span>Undetermined, displaying whole FIR<br/>";
                        text = text + "<hr style='margin:1px 0 1px 0'/>" + rawtext + "</div>";
                        var lines = text.match(/<br\/>/g);
                        lines = (lines == null? 3: lines.length);
                        var rules = text.match(/<hr\/>/g);
                        rules = (rules == null? 0: rules.length);
                        var height = 16*(lines + 1 + rules);
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size( 360, height ),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "AirmetTurb":
            function AirmetTurb(options){
                var self = this;
                this.proto_opts = {type: "turb"};
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.getTop = function(value){return this.proto_opts['top'];};
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.getBottom = function(value){return this.proto_opts['bottom'];};
                this.redraw = function(){this.layer.redraw()};
                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor": "#FF6600",
                            "fillOpacity": 0.2,
                            "strokeColor": "#FF6600",
                            "strokeOpacity": 1,
                            "strokeWidth": 2,
                            "label": "Turb",
                            "fontSize": "10px",
                            "fontColor": "#FF6600",
                            "labelOutlineColor": "white",
                            "labelOutlineWidth": 3,
                            "pointRadius": 5}),
                        "select": new OpenLayers.Style({
                            "fillColor": "#FFB080",
                            "strokeColor": "#FFB080"
                            })
                        });
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/AirmetJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/AirmetJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("AirmetTurb",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": stylemap,
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var rawtext = feature.attributes.rawAirSigmet;
                        rawtext = rawtext.replace(/\n/g, "<br/>")
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white;font-weight:bold'>" +
                        feature.attributes.hazard + " AIRMET"  + "</div>";
                        text = text + spancol+"Center/Region: </span>" + feature.attributes.icaoId + "<br/>";
                        text = text + spancol+"Begins: </span>" + feature.attributes.validTimeFrom + "<br/>";
                        text = text + spancol+"Ends: </span>" + feature.attributes.validTimeTo + "<br/>";
                        if( feature.attributes.altitudeHi2 != undefined )
                        text = text + spancol+"Top: </span>" + feature.attributes.altitudeHi2 + " ft<br/>";
                        if( feature.attributes.altitudeLow1 != undefined )
                            text = text + spancol+"Base: </span>" + feature.attributes.altitudeLow1 + " ft<br/>";
                        text = text + "<hr style='margin:1px 0 1px 0'/>" + rawtext + "</div>";
                        var lines = text.match(/<br\/>/g);
                        lines = (lines == null? 3: lines.length);
                        var rules = text.match(/<hr\/>/g);
                        rules = (rules == null? 0: rules.length);
                        height = 14*(lines + 2 + rules);
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size( 400, height ),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "AirmetLlws":
            function AirmetLlws(options){
                var self = this;
                this.proto_opts = {type: "llws"};
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.getTop = function(value){return this.proto_opts['top'];};
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.getBottom = function(value){return this.proto_opts['bottom'];};
                this.redraw = function(){this.layer.redraw()};
                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor": "#FF6600",
                            "fillOpacity": 0.2,
                            "strokeColor": "#FF6600",
                            "strokeOpacity": 1,
                            "strokeWidth": 2,
                            "label": "LLWS",
                            "fontSize": "10px",
                            "fontColor": "#FF6600",
                            "labelOutlineColor": "white",
                            "labelOutlineWidth": 3,
                            "pointRadius": 5}),
                        "select": new OpenLayers.Style({
                            "fillColor": "#FFB080",
                            "strokeColor": "#FFB080"
                            })
                        });
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/AirmetJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/AirmetJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("AirmetLlws",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": stylemap,
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var rawtext = feature.attributes.rawAirSigmet;
                        rawtext = rawtext.replace(/\n/g, "<br/>")
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white;font-weight:bold'>" +
                        feature.attributes.hazard + " POTENTIAL"  + "</div>";
                        text = text + spancol+"Center/Region: </span>" + feature.attributes.icaoId + "<br/>";
                        text = text + spancol+"Begins: </span>" + feature.attributes.validTimeFrom + "<br/>";
                        text = text + spancol+"Ends: </span>" + feature.attributes.validTimeTo + "<br/>";
                        if( feature.attributes.altitudeHi2 != undefined )
                        text = text + spancol+"Top: </span>" + feature.attributes.altitudeHi2 + " ft<br/>";
                        if( feature.attributes.altitudeLow1 != undefined )
                            text = text + spancol+"Base: </span>" + feature.attributes.altitudeLow1 + " ft<br/>";
                        text = text + "<hr style='margin:1px 0 1px 0'/>" + rawtext + "</div>";
                        var lines = text.match(/<br\/>/g);
                        lines = (lines == null? 3: lines.length);
                        var rules = text.match(/<hr\/>/g);
                        rules = (rules == null? 0: rules.length);
                        height = 14*(lines + 2 + rules);
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size( 400, height ),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "AirmetIcing":
            function AirmetIcing(options){
                var self = this;
                this.proto_opts = {type: "ice"};
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.redraw = function(){this.layer.redraw()};
                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor": "#0000FF",
                            "fillOpacity": 0.2,
                            "strokeColor": "#0000FF",
                            "strokeOpacity": 1,
                            "strokeWidth": 2,
                            "label": "Icing",
                            "fontSize": "10px",
                            "fontColor": "#0000FF",
                            "labelOutlineColor": "white",
                            "labelOutlineWidth": 3,
                            "pointRadius": 5}),
                        "select": new OpenLayers.Style({
                            "fillColor": "#8080FF",
                            "strokeColor": "#8080FF"
                            })
                        });
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/AirmetJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/AirmetJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }

                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("AirmetIcing",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": stylemap,
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var rawtext = feature.attributes.rawAirSigmet;
                        rawtext = rawtext.replace(/\n/g, "<br/>")
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white;font-weight:bold'>" +
                        feature.attributes.hazard + " AIRMET"  + "</div>";
                        text = text + spancol+"Center/Region: </span>" + feature.attributes.icaoId + "<br/>";
                        text = text + spancol+"Begins: </span>" + feature.attributes.validTimeFrom + "<br/>";
                        text = text + spancol+"Ends: </span>" + feature.attributes.validTimeTo + "<br/>";
                        if( feature.attributes.altitudeHi2 != undefined )
                        text = text + spancol+"Top: </span>" + feature.attributes.altitudeHi2 + " ft<br/>";
                        if( feature.attributes.altitudeLow1 != undefined ){
                            if( feature.attributes.altitudeLow1 == 0 )
                                text = text + spancol+"Base: </span> Freezing Level<br/>";
                            else
                                text = text + spancol+"Base: </span>" + feature.attributes.altitudeLow1 + " ft<br/>";
                        }
                        text = text + "<hr style='margin:1px 0 1px 0'/>" + rawtext + "</div>";
                        var lines = text.match(/<br\/>/g);
                        lines = (lines == null? 3: lines.length);
                        var rules = text.match(/<hr\/>/g);
                        rules = (rules == null? 0: rules.length);
                        height = 14*(lines + 2 + rules);
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size( 400, height ),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "AirmetIfr":
            function AirmetIfr(options){
                var self = this;
                this.proto_opts = {type: "ifr"};
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.redraw = function(){this.layer.redraw()};
                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor": "#990099",
                            "fillOpacity": 0.2,
                            "strokeColor": "#990099",
                            "strokeOpacity": 1,
                            "strokeWidth": 2,
                            "label": "IFR",
                            "fontSize": "10px",
                            "fontColor": "#990099",
                            "labelOutlineColor": "white",
                            "labelOutlineWidth": 3,
                            "pointRadius": 5}),
                        "select": new OpenLayers.Style({
                            "fillColor": "#B080B0",
                            "strokeColor": "#B080B0"
                            })
                        });
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/AirmetJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/AirmetJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }

                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("AirmetIfr",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": stylemap,
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var rawtext = feature.attributes.rawAirSigmet;
                        rawtext = rawtext.replace(/\n/g, "<br/>")
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white;font-weight:bold'>" +
                        feature.attributes.hazard + " AIRMET"  + "</div>";
                        text = text + spancol+"Center/Region: </span>" + feature.attributes.icaoId + "<br/>";
                        text = text + spancol+"Begins: </span>" + feature.attributes.validTimeFrom + "<br/>";
                        text = text + spancol+"Ends: </span>" + feature.attributes.validTimeTo + "<br/>";
                        if( feature.attributes.altitudeHi2 != undefined )
                        text = text + spancol+"Top: </span>" + feature.attributes.altitudeHi2 + " ft<br/>";
                        if( feature.attributes.altitudeLow1 != undefined )
                            text = text + spancol+"Base: </span>" + feature.attributes.altitudeLow1 + " ft<br/>";
                        text = text + "<hr style='margin:1px 0 1px 0'/>" + rawtext + "</div>";
                        var lines = text.match(/<br\/>/g);
                        lines = (lines == null? 3: lines.length);
                        var rules = text.match(/<hr\/>/g);
                        rules = (rules == null? 0: rules.length);
                        var height = 14*(lines + 2 + rules);
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size( 400, height ),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "AirmetMtn":
            function AirmetMtn(options){
                var self = this;
                this.proto_opts = {type: "mtn"};
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.redraw = function(){this.layer.redraw()};
                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor": "#FF00FF",
                            "fillOpacity": 0.2,
                            "strokeColor": "#FF00FF",
                            "strokeOpacity": 1,
                            "strokeWidth": 2,
                            "label": "MtnOb",
                            "fontSize": "10px",
                            "fontColor": "#FF00FF",
                            "labelOutlineColor": "white",
                            "labelOutlineWidth": 3,
                            "pointRadius": 5}),
                        "select": new OpenLayers.Style({
                            "fillColor": "#FF80FF",
                            "strokeColor": "#FF80FF"
                            })
                        });
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/AirmetJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/AirmetJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }

                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("AirmetMtn",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": stylemap,
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var rawtext = feature.attributes.rawAirSigmet;
                        rawtext = rawtext.replace(/\n/g, "<br/>")
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white;font-weight:bold'>" +
                        feature.attributes.hazard + " AIRMET"  + "</div>";
                        text = text + spancol+"Center/Region: </span>" + feature.attributes.icaoId + "<br/>";
                        text = text + spancol+"Begins: </span>" + feature.attributes.validTimeFrom + "<br/>";
                        text = text + spancol+"Ends: </span>" + feature.attributes.validTimeTo + "<br/>";
                        if( feature.attributes.altitudeHi2 != undefined )
                        text = text + spancol+"Top: </span>" + feature.attributes.altitudeHi2 + " ft<br/>";
                        if( feature.attributes.altitudeLow1 != undefined )
                            text = text + spancol+"Base: </span>" + feature.attributes.altitudeLow1 + " ft<br/>";
                        text = text + "<hr style='margin:1px 0 1px 0'/>" + rawtext + "</div>";
                        var lines = text.match(/<br\/>/g);
                        lines = (lines == null? 3: lines.length);
                        var rules = text.match(/<hr\/>/g);
                        rules = (rules == null? 0: rules.length);
                        var height = 14*(lines + 2 + rules);
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size( 400, height ),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "Gairmet":
            function Gairmet(options){
                var self = this;
                this.opacity = 0.25;
                this.proto_opts = {
                    "fore": -1,
                    "type": "all"
                };
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.fore != undefined )
                        this.proto_opts['fore'] =  options.fore;
                    if( options.level != undefined )
                        this.proto_opts['level'] = options.level;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                    if( options.type != undefined )
                        this.proto_opts['type'] = options.type;
                    if( options.opacity != undefined )
                        this.opacity = options.opacity;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setFore = function( value ){ this.proto_opts['fore'] = value; };
                this.getFore = function(){ return this.proto_opts['fore']; };
                this.setType = function( value ){ this.proto_opts['type'] = value; };
                this.getType = function( ){ return this.proto_opts['type']; };
                this.setLevel = function(value){this.proto_opts['level'] = value;};
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.setOpacity = function(value){this.opacity = value;};
                this.getOpacity = function(){return this.opacity;};
                this.redraw = function(){ this.layer.redraw(); };
                var context = {
                    "getColor":
                        function(feature){
                            if( feature.attributes.hazard == "TURB-HI" )
                                return "#FF6600";
                            if( feature.attributes.hazard == "TURB-LO" )
                                return "#CC3300";
                            if( feature.attributes.hazard == "LLWS" )
                                return "#993333";
                            if( feature.attributes.hazard == "SFC_WND" )
                                return "#CC6600";
                            if( feature.attributes.hazard == "IFR" )
                                return "#990099";
                            if( feature.attributes.hazard == "MT_OBSC" )
                                return "#FF00FF";
                            if( feature.attributes.hazard == "ICE" )
                                return "#0000FF";
                            if( feature.attributes.hazard == "FZLVL" )
                                return "#6666FF";
                            if( feature.attributes.hazard == "M_FZLVL" )
                                return "#6666FF";
                            return "#800000";
                        },
                    "getHighlightColor":
                        function(feature){
                            if( feature.attributes.hazard == "TURB-HI" )
                                return "#FFB080";
                            if( feature.attributes.hazard == "TURB-LO" )
                                return "#FFB080";
                            if( feature.attributes.hazard == "LLWS" )
                                return "#FF8080";
                            if( feature.attributes.hazard == "IFR" )
                                return "#FF80FF";
                            if( feature.attributes.hazard == "MT_OBSC" )
                                return "#FF80FF";
                            if( feature.attributes.hazard == "ICE" )
                                return "#8080FF";
                            if( feature.attributes.hazard == "FZLVL" )
                                return "#8080FF";
                            if( feature.attributes.hazard == "M_FZLVL" )
                                return "#8080FF";
                            return "#FF8080";
                        },
                    "getLabel":
                        function(feature){
                            if( feature.attributes.hazard == "TURB-HI" )
                                return "TurbHi";
                            if( feature.attributes.hazard == "TURB-LO" )
                                return "TurbLo";
                            if( feature.attributes.hazard == "LLWS" )
                                return "LLWS";
                            if( feature.attributes.hazard == "SFC_WND" )
                                return "SfcWind";
                            if( feature.attributes.hazard == "IFR" )
                                return "IFR";
                            if( feature.attributes.hazard == "MT_OBSC" )
                                return "MtnOb";
                            if( feature.attributes.hazard == "ICE" )
                                return "Icing";
                            if( feature.attributes.hazard == "FZLVL" )
                                return feature.attributes.level;
                            if( feature.attributes.hazard == "M_FZLVL" )
                                return feature.attributes.base+"-"+feature.attributes.top;
                            return "UNK";
                        },
                    "getOpacity":
                        function(feature){
                            return self.opacity;
                        }
                }
                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor": "${getColor}",
                            "fillOpacity": "${getOpacity}",
                            "strokeColor": "${getColor}",
                            "strokeOpacity": 1,
                            "strokeWidth": 2,
                            "label": "${getLabel}",
                            "fontSize": "10px",
                            "fontColor": "${getColor}",
                            "labelOutlineColor": "white",
                            "labelOutlineWidth": 3,
                            "pointRadius": 5
                            }, {
                            "context": context
                            }),
                        "select": new OpenLayers.Style({
                            "fillColor": "${getHighlightColor}",
                            "strokeColor": "${getHighlightColor}"
                            }, {
                            "context": context
                            })
                });
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/GairmetJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/GairmetJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("Gairmet",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": stylemap,
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white;font-weight:bold'>" +
                        feature.attributes.hazard + " G-AIRMET"  + "</div>";
                        text = text + spancol+"Valid: </span>" + feature.attributes.validTime + "<br/>";
                        if( feature.attributes.severity != undefined )
                        text = text + spancol+"Severity: </span>" + feature.attributes.severity + "<br/>";
                        if( feature.attributes.top != undefined )
                        text = text + spancol+"Top: </span>" + feature.attributes.top + "00 ft<br/>";
                        if( feature.attributes.base != undefined ){
                        if( feature.attributes.base == "FZL" )
                            text = text + spancol+"Base: </span>Freezing level " + feature.attributes.fzltop + "/" + feature.attributes.fzlbase + "<br/>";
                        else if( feature.attributes.base == "SFC" )
                            text = text + spancol+"Base: </span>Surface<br/>";
                        else
                            text = text + spancol+"Base: </span>" + feature.attributes.base + "00 ft<br/>";
                        }
                        if( feature.attributes.level != undefined ){
                            if( feature.attributes.level == "SFC" )
                                text = text + spancol+"Level: </span>SFC<br/>";
                            else
                                text = text + spancol+"Level: </span>" + feature.attributes.level + "00 ft<br/>";
                        }
                        if( feature.attributes.dueTo != undefined )
                            text = text + spancol+"Due to: </span>" + feature.attributes.dueTo + "<br/>";
                        if( feature.attributes.hazard == "LLWS" )
                            text = text + spancol+"Due to: </span>AIR SPEED LOSS OR GAIN OF 20KTS OR MORE BELOW 2000 FT AGL<br/>";
                        if( feature.attributes.hazard == "SFC_WND" )
                            text = text + spancol+"Due to: </span>SUSTAINED SFC WINDS GREATER THAN 30 KTS<br/>";
                        text = text + "</div>";
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size( 250, 70 ),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "GairmetTurbHi":
            function GairmetTurbHi(options){
                var self = this;
                this.proto_opts = {
                    "fore": -1,
                    "type": "turb-hi"
                };
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.fore != undefined )
                        this.proto_opts['fore'] =  options.fore;
                    if( options.level != undefined )
                        this.proto_opts['level'] = options.level;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setFore = function( value ){ this.proto_opts['fore'] = value; };
                this.getFore = function(){ return this.proto_opts['fore']; };
                this.setLevel = function(value){this.proto_opts['level'] = value;};
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.getTop = function(){ return this.proto_opts['top']; };
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.getBottom = function(){ return this.proto_opts['bottom']; };
                this.redraw = function(){ this.layer.redraw(); };
                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor": "#FF6600",
                            "fillOpacity": 0.2,
                            "strokeColor": "#FF6600",
                            "strokeOpacity": 1,
                            "strokeWidth": 2,
                            "label": "TurbHi",
                            "fontSize": "10px",
                            "fontColor": "#FF6600",
                            "labelOutlineColor": "white",
                            "labelOutlineWidth": 3,
                            "pointRadius": 5}),
                        "select": new OpenLayers.Style({
                            "fillColor": "#FFB080",
                            "strokeColor": "#FFB080"
                            })
                        });
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/GairmetJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/GairmetJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("GairmetTurbHi",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": stylemap,
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white;font-weight:bold'>" +
                        "High Level Turbulence G-AIRMET"  + "</div>";
                        text = text + spancol+"Valid: </span>" + feature.attributes.validTime + "<br/>";
                        text = text + spancol+"Severity: </span>" + feature.attributes.severity + "<br/>";
                        text = text + spancol+"Top: </span>" + feature.attributes.top + "00 ft<br/>";
                        if( feature.attributes.base == "SFC" )
                        text = text + spancol+"Base: </span>Surface<br/>";
                        else
                        text = text + spancol+"Base: </span>" + feature.attributes.base + "00 ft<br/>";
                        text = text + "</div>";
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size( 250, 70 ),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "GairmetTurbLo":
            function GairmetTurbLo(options){
                var self = this;
                this.server = AWC_OpenLayers.Library.getServer();
                this.proto_opts = {
                    "fore": -1,
                    "type": "turb-lo"
                };
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.fore != undefined )
                        this.proto_opts['fore'] =  options.fore;
                    if( options.level != undefined )
                        this.proto_opts['level'] = options.level;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setFore = function( value ){ this.proto_opts['fore'] = value; };
                this.getFore = function(){ return this.proto_opts['fore']; };
                this.setLevel = function(value){this.proto_opts['level'] = value;};
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.redraw = function(){ this.layer.redraw(); };
                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor": "#CC3300",
                            "fillOpacity": 0.2,
                            "strokeColor": "#CC3300",
                            "strokeOpacity": 1,
                            "strokeWidth": 2,
                            "label": "TurbLo",
                            "fontSize": "10px",
                            "fontColor": "#CC3300",
                            "labelOutlineColor": "white",
                            "labelOutlineWidth": 3,
                            "pointRadius": 5}),
                        "select": new OpenLayers.Style({
                            "fillColor": "#FFB080",
                            "strokeColor": "#FFB080"
                            })
                        });
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/GairmetJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/GairmetJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("GairmetTurbLo",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": stylemap,
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white;font-weight:bold'>" +
                        "Low Level Turbulence G-AIRMET"  + "</div>";
                        text = text + spancol+"Valid: </span>" + feature.attributes.validTime + "<br/>";
                        text = text + spancol+"Severity: </span>" + feature.attributes.severity + "<br/>";
                        text = text + spancol+"Top: </span>" + feature.attributes.top + "00 ft<br/>";
                        if( feature.attributes.base == "SFC" )
                        text = text + spancol+"Base: </span>Surface<br/>";
                        else
                        text = text + spancol+"Base: </span>" + feature.attributes.base + "00 ft<br/>";
                        text = text + "</div>";
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size( 250, 70 ),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "GairmetLlws":
            function GairmetLlws(options){
                var self = this;
                this.server = AWC_OpenLayers.Library.getServer();
                this.proto_opts = {
                    "fore": -1,
                    "type": "llws"
                };
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.fore != undefined )
                        this.proto_opts['fore'] =  options.fore;
                    if( options.level != undefined )
                        this.proto_opts['level'] = options.level;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setFore = function( value ){ this.proto_opts['fore'] = value; };
                this.getFore = function(){ return this.proto_opts['fore']; };
                this.setLevel = function(value){this.proto_opts['level'] = value;};
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.redraw = function(){ this.layer.redraw(); };
                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor": "#993333",
                            "fillOpacity": 0.2,
                            "strokeColor": "#993333",
                            "strokeOpacity": 1,
                            "strokeWidth": 2,
                            "label": "LLWS",
                            "fontSize": "10px",
                            "fontColor": "#993333",
                            "labelOutlineColor": "white",
                            "labelOutlineWidth": 3,
                            "pointRadius": 5}),
                        "select": new OpenLayers.Style({
                            "fillColor": "#FF8080",
                            "strokeColor": "#FF8080"
                            })
                        });
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/GairmetJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/GairmetJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("GairmetLlws", {
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": stylemap,
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white;font-weight:bold'>" +
                        "Low Level Wind Shear G-AIRMET"  + "</div>";
                        text = text + spancol+"Valid: </span>" + feature.attributes.validTime + "<br/>";
                        text = text + spancol+"Due to: </span>AIR SPEED LOSS OR GAIN OF 20KTS OR MORE BELOW 2000 FT AGL<br/>";
                        text = text + "</div>";
                        var popup = new OpenLayers.Popup.Anchored("popup",
                            new OpenLayers.LonLat( centroid.x, centroid.y ),
                            new OpenLayers.Size( 250, 70 ),
                            text,
                            null,
                            true
                            );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "GairmetSfcWind":
            function GairmetSfcWind(options){
                var self = this;
                this.server = AWC_OpenLayers.Library.getServer();
                this.proto_opts = {
                    "fore": -1,
                    "type": "sfc-wind"
                };
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.fore != undefined )
                        this.proto_opts['fore'] =  options.fore;
                    if( options.level != undefined )
                        this.proto_opts['level'] = options.level;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setFore = function( value ){ this.proto_opts['fore'] = value; };
                this.getFore = function(){ return this.proto_opts['fore']; };
                this.setLevel = function(value){this.proto_opts['level'] = value;};
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.redraw = function(){ this.layer.redraw(); };
                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor": "#CC6600",
                            "fillOpacity": 0.2,
                            "strokeColor": "#CC6600",
                            "strokeOpacity": 1,
                            "strokeWidth": 2,
                            "label": "SfcWind",
                            "fontSize": "10px",
                            "fontColor": "#CC6600",
                            "labelOutlineColor": "white",
                            "labelOutlineWidth": 3,
                            "pointRadius": 5}),
                        "select": new OpenLayers.Style({
                            "fillColor": "#FF8080",
                            "strokeColor": "#FF8080"
                            })
                        });
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/GairmetJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/GairmetJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("GairmetSfcWind",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": stylemap,
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white;font-weight:bold'>" +
                        "Surface Winds G-AIRMET"  + "</div>";
                        text = text + spancol+"Valid: </span>" + feature.attributes.validTime + "<br/>";
                        text = text + spancol+"Due to: </span>SUSTAINED SFC WINDS GREATER THAN 30 KTS<br/>";
                        text = text + "</div>";
                        var popup = new OpenLayers.Popup.Anchored("popup",
                            new OpenLayers.LonLat( centroid.x, centroid.y ),
                            new OpenLayers.Size( 250, 70 ),
                            text,
                            null,
                            true
                            );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "GairmetIfr":
            function GairmetIfr(options){
                var self = this;
                this.server = AWC_OpenLayers.Library.getServer();
                this.proto_opts = {
                    "fore": -1,
                    "type": "ifr"
                };
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.fore != undefined )
                        this.proto_opts['fore'] =  options.fore;
                    if( options.level != undefined )
                        this.proto_opts['level'] = options.level;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setFore = function( value ){ this.proto_opts['fore'] = value; };
                this.getFore = function(){ return this.proto_opts['fore']; };
                this.setLevel = function(value){this.proto_opts['level'] = value;};
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.redraw = function(){ this.layer.redraw(); };
                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor": "#990099",
                            "fillOpacity": 0.2,
                            "strokeColor": "#990099",
                            "strokeOpacity": 1,
                            "strokeWidth": 2,
                            "label": "IFR",
                            "fontSize": "10px",
                            "fontColor": "#990099",
                            "labelOutlineColor": "white",
                            "labelOutlineWidth": 3,
                            "pointRadius": 5}),
                        "select": new OpenLayers.Style({
                            "fillColor": "#FF80FF",
                            "strokeColor": "#FF80FF"
                            })
                        });
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/GairmetJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/GairmetJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("GairmetIfr",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": stylemap,
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white;font-weight:bold'>" +
                        "Ceil&Vis (IFR) G-AIRMET"  + "</div>";
                        text = text + spancol+"Valid: </span>" + feature.attributes.validTime + "<br/>";
                        text = text + spancol+"Due to: </span>" + feature.attributes.dueTo + "<br/>";
                        text = text + "</div>";
                        var popup = new OpenLayers.Popup.Anchored("popup",
                            new OpenLayers.LonLat( centroid.x, centroid.y ),
                            new OpenLayers.Size( 250, 70 ),
                            text,
                            null,
                            true
                            );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "GairmetMtn":
            function GairmetMtn(options){
                var self = this;
                this.server = AWC_OpenLayers.Library.getServer();
                this.proto_opts = {
                    "fore": -1,
                    "type": "mtn"
                };
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.fore != undefined )
                        this.proto_opts['fore'] =  options.fore;
                    if( options.level != undefined )
                        this.proto_opts['level'] = options.level;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setFore = function( value ){ this.proto_opts['fore'] = value; };
                this.getFore = function(){ return this.proto_opts['fore']; };
                this.setLevel = function(value){this.proto_opts['level'] = value;};
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.redraw = function(){ this.layer.redraw(); };
                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor": "#FF00FF",
                            "fillOpacity": 0.2,
                            "strokeColor": "#FF00FF",
                            "strokeOpacity": 1,
                            "strokeWidth": 2,
                            "label": "MtnOb",
                            "fontSize": "10px",
                            "fontColor": "#FF00FF",
                            "labelOutlineColor": "white",
                            "labelOutlineWidth": 3,
                            "pointRadius": 5}),
                        "select": new OpenLayers.Style({
                            "fillColor": "#FF80FF",
                            "strokeColor": "#FF80FF"
                            })
                        });
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/GairmetJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/GairmetJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("GairmetMtn",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": stylemap,
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white;font-weight:bold'>" +
                        "Mountain Obscuration G-AIRMET"  + "</div>";
                        text = text + spancol+"Valid: </span>" + feature.attributes.validTime + "<br/>";
                        text = text + spancol+"Due to: </span>" + feature.attributes.dueTo + "<br/>";
                        text = text + "</div>";
                        var popup = new OpenLayers.Popup.Anchored("popup",
                            new OpenLayers.LonLat( centroid.x, centroid.y ),
                            new OpenLayers.Size( 250, 70 ),
                            text,
                            null,
                            true
                            );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "GairmetIcing":
            function GairmetIcing(options){
                var self = this;
                this.server = AWC_OpenLayers.Library.getServer();
                this.proto_opts = {
                    "fore": -1,
                    "type": "icing"
                };
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.fore != undefined )
                        this.proto_opts['fore'] =  options.fore;
                    if( options.level != undefined )
                        this.proto_opts['level'] = options.level;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setFore = function( value ){ this.proto_opts['fore'] = value; };
                this.getFore = function(){ return this.proto_opts['fore']; };
                this.setLevel = function(value){this.proto_opts['level'] = value;};
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.redraw = function(){ this.layer.redraw(); };
                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor": "#0000FF",
                            "fillOpacity": 0.2,
                            "strokeColor": "#0000FF",
                            "strokeOpacity": 1,
                            "strokeWidth": 2,
                            "label": "Icing",
                            "fontSize": "10px",
                            "fontColor": "#0000FF",
                            "labelOutlineColor": "white",
                            "labelOutlineWidth": 3,
                            "pointRadius": 5}),
                        "select": new OpenLayers.Style({
                            "fillColor": "#8080FF",
                            "strokeColor": "#8080FF"
                            })
                        });
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/GairmetJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/GairmetJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("GairmetIcing",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": stylemap,
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white;font-weight:bold'>" +
                        "Icing G-AIRMET"  + "</div>";
                        text = text + spancol+"Valid: </span>" + feature.attributes.validTime + "<br/>";
                        if( feature.attributes.severity != undefined )
                        text = text + spancol+"Severity: </span>" + feature.attributes.severity + "<br/>";
                        text = text + spancol+"Top: </span>" + feature.attributes.top + "00 ft<br/>";
                        if( feature.attributes.base == "FZL" )
                        text = text + spancol+"Base: </span>Freezing level " + feature.attributes.fzltop + "/" + feature.attributes.fzlbase + "<br/>";
                        else if( feature.attributes.base == "SFC" )
                            text = text + spancol+"Base: </span>Surface<br/>";
                        else
                            text = text + spancol+"Base: </span>" + feature.attributes.base + "00 ft<br/>";
                        if( feature.attributes.dueTo != undefined )
                            text = text + spancol+"Due to: </span>" + feature.attributes.dueTo + "<br/>";
                        text = text + "</div>";
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size( 250, 90 ),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "GairmetFzlvl":
            function GairmetFzlvl(options){
                var self = this;
                this.server = AWC_OpenLayers.Library.getServer();
                this.proto_opts = {
                    "fore": -1,
                    "type": "fzlvl"
                };
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.fore != undefined )
                        this.proto_opts['fore'] =  options.fore;
                    if( options.level != undefined )
                        this.proto_opts['level'] = options.level;
                    if( options.top != undefined )
                        this.proto_opts['top'] = options.top;
                    if( options.bottom != undefined )
                        this.proto_opts['bottom'] = options.bottom;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setFore = function( value ){ this.proto_opts['fore'] = value; };
                this.getFore = function(){ return this.proto_opts['fore']; };
                this.setLevel = function(value){this.proto_opts['level'] = value;};
                this.setTop = function(value){this.proto_opts['top'] = value;};
                this.setBottom = function(value){this.proto_opts['bottom'] = value;};
                this.redraw = function(){ this.layer.redraw(); };
                var context = {
                    "getLabel":
                        function(feature){
                            if( feature.attributes.hazard == "FZLVL" )
                                return "Frz@" + feature.attributes.level;
                            if( feature.attributes.hazard == "M_FZLVL" )
                                return "Frz:" + feature.attributes.base+"-"+feature.attributes.top;
                        }
                };
                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor": "${getColor}",
                            "fillOpacity": 0.2,
                            "strokeColor": "#6666CC",
                            "strokeOpacity": 1,
                            "strokeWidth": 3,
                            "label": "${getLabel}",
                            "fontSize": "10px",
                            "fontColor": "#6666CC",
                            "labelOutlineColor": "white",
                            "labelOutlineWidth": 3,
                            "pointRadius": 5},
                            {"context": context}),
                        "select": new OpenLayers.Style({
                            "strokeColor": "#8080FF"
                            },
                            {"context": context})
                        });
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/GairmetJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/GairmetJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("GairmetFzlvl",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": stylemap,
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var hazard = "Freezing Level";
                        if( feature.attributes.hazard == "M_FZLVL" )
                        hazard = "Multiple Freezing Level";

                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white;font-weight:bold'>" +
                        hazard + " G-AIRMET"  + "</div>";
                        text = text + spancol+"Valid: </span>" + feature.attributes.validTime + "<br/>";
                        if( feature.attributes.top != undefined )
                        text = text + spancol+"Top: </span>" + feature.attributes.top + "00 ft<br/>";
                        if( feature.attributes.base != undefined ){
                            if( feature.attributes.base == "SFC" )
                                text = text + spancol+"Base: </span>Surface<br/>";
                            else
                                text = text + spancol+"Base: </span>" + feature.attributes.base + "00 ft<br/>";
                        }
                        if( feature.attributes.level != undefined ){
                            if( feature.attributes.level == "SFC" )
                                text = text + spancol+"Level: </span>SFC<br/>";
                            else
                                text = text + spancol+"Level: </span>" + feature.attributes.level + "00 ft<br/>";
                        }
                        text = text + "</div>";
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size( 250, 70 ),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    'featureunselected':
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "Ccfp":
            function Ccfp(options){
                this.server = AWC_OpenLayers.Library.getServer();
                this.proto_opts = {
                    "fore": null,
                    "date": null
                };
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.fore != undefined )
                        this.proto_opts['fore'] =  options.fore;
                    if( options.date != undefined )
                        this.proto_opts['date'] =  options.date;
                }
                this.setFore = function( value ){ this.proto_opts['fore'] = value; };
                this.getFore = function(){ return this.proto_opts['fore']; };
                this.redraw = function(){ this.layer.redraw(); };
                var context = {
                    "getLabel":
                        function(feature){
                            var label = "";
                            if( feature.attributes.type == 'Out of season' )
                                label = "Out of Season";
                            if( feature.attributes.coverage == 'Sparse' )
                                label = label + "S";
                            else if( feature.attributes.coverage == 'Medium' )
                                label = label + "M";
                            else if( feature.attributes.coverage == 'Solid' )
                                label = label + "H";
                            else if( feature.attributes.coverage == 'High' )
                                label = label + "H";
                            if( feature.attributes.type == 'Area' ){
                                label = label + "/";
                                if( feature.attributes.tops == "FL>400" )
                                    label = label + ">400";
                                else
                                    label = label + feature.attributes.tops.substr(8,3);
                            }
                            return label;
                        },
                    "getFontSize":
                        function(feature){
                            if( feature.attributes.type == 'Out of season' )
                                return '18px';
                            return '10px';
                        },
                    "getColor":
                        function(feature){
                            if( feature.attributes.type == 'Out of season' )
                                return '#000000';
                            if( feature.attributes.type == 'Line' )
                                return '#AA00AA';
                            if( feature.attributes.confidence == 'Low' )
                                return '#404040';
                            return '#0040AA';
                        },
                    "getHighlightColor":
                        function(feature){
                            if( feature.attributes.type == 'Out of season' )
                                return '#000000';
                            if( feature.attributes.type == 'Line' )
                                return '#FF55FF';
                            if( feature.attributes.confidence == 'Low' )
                                return '#AAAAAA';
                            return '#0088FF';
                        },
                    "getOpacity":
                        function(feature){
                            if( feature.attributes.coverage == 'Sparse' )
                                return 0.2;
                            if( feature.attributes.coverage == 'Medium' )
                                return 0.5;
                            return 0.8;
                        },
                    "getZindex":
                        function(feature){
                            if( feature.attributes.coverage == 'Sparse' )
                                return 16;
                            if( feature.attributes.coverage == 'Medium' )
                                return 18;
                            return 20;
                        }
                };

                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor": "${getColor}",
                            "fillOpacity": "${getOpacity}",
                            "strokeColor": "${getColor}",
                            "graphicZIndex": "${getZindex}",
                            "strokeOpacity": 1,
                            "strokeWidth": 2,
                            "label": "${getLabel}",
                            "fontSize": "${getFontSize}",
                            "fontColor": "${getColor}",
                            "labelOutlineColor": "white",
                            "labelOutlineWidth": 3,
                            "pointRadius": 5
                            }, {
                            "context": context
                            }),
                        "select": new OpenLayers.Style({
                            "fillColor": "${getHighlightColor}",
                            "strokeColor": "${getHighlightColor}"
                            }, {
                            "context": context
                            })
                });
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/CcfpJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/CcfpJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                // create the layer with listeners to create and destroy popups
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("CCFP",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": stylemap,
                        "eventListeners":{
                        "featureselected":function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var text = "<div style='background-color: #1150a0; font-size:10px; color:white'><b>";
                        if( feature.attributes.type == "Out of season" )
                        text = text + "CCFP</b></div><div style='font-size: 10px'>";
                        else if( feature.attributes.type == "Area" )
                        text = text + "CCFP Area</b></div><div style='font-size: 10px'>";
                        else
                        text = text + "CCFP Line</b></div><div style='font-size: 10px'>";
                        if( feature.attributes.type == "Out of season" )
                        text = text + "CCFP is out of season from the start of November to the end of February. Please check back at the start of March";
                        else
                        text = text + "<div style='font-size:10px'>Coverage: " + feature.attributes.coverage+"<br/>";
                        if( feature.attributes.type == "Area" ){
                            text = text + "Confidence: "+feature.attributes.confidence+"<br/>";
                            text = text + "Growth: "+feature.attributes.growth+"<br/>";
                            text = text + "Tops: "+feature.attributes.tops+"<br/>";
                            text = text + "Movement: "+feature.attributes.movement;
                        }
                        text = text + "</div>";
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size( 200, 75 ),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                        "featureunselected":function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "Cwa":
            function Cwa(options){
                var self = this;
                this.server = AWC_OpenLayers.Library.getServer();
                this.opacity = 0.5;
                this.proto_opts = {};
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.level != undefined )
                        this.proto_opts['level'] = options.level;
                    if( options.opacity != undefined )
                        this.opacity = options.opacity;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setLevel = function( value ){ this.proto_opts['level'] = value; };
                this.setOpacity = function(value){this.opacity = value;};
                this.getOpacity = function(){return this.opacity;};
                this.redraw = function(){ this.layer.redraw(); };
                var context = {
                    "getColor":
                        function(feature){
                            if( feature.attributes.hazard == "ICE" )
                                return "#000080";
                            if( feature.attributes.hazard == "TURB" )
                                return "#A06000";
                            if( feature.attributes.hazard == "IFR" )
                                return "#800080";
                            if( feature.attributes.hazard == "PCPN" )
                                return "#800080";
                            return "#800000";
                        },
                    "getHighlightColor":
                        function(feature){
                            if( feature.attributes.hazard == "ICE" )
                                return "#8080FF";
                            if( feature.attributes.hazard == "TURB" )
                                return "#FFA000";
                            if( feature.attributes.hazard == "IFR" )
                                return "#FF00FF";
                            if( feature.attributes.hazard == "PCPN" )
                                return "#FF00FF";
                            return "#FF8080";
                        },
                    "getOpacity":
                        function(feature){
                            return self.opacity;
                        }
                };
                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor" : "${getColor}",
                            "fillOpacity" : "${getOpacity}",
                            "label": "${hazard}",
                            "fontSize": "10px",
                            "fontColor": "#000000",
                            "labelOutlineColor": "white",
                            "labelOutlineWidth": 3,
                            "strokeColor" : "#000000",
                            "strokeOpacity" : 1,
                            "strokeWidth" : 2,
                            "pointRadius" : 10
                            }, {
                            "context": context }),
                        "select": new OpenLayers.Style({
                            "fillColor" : "${getHighlightColor}",
                            "strokeColor" : "#FFFFFF"
                            }, {
                            "context": context })
                        }
                );
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/CwaJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server+"/gis/scripts/CwaJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                // create the layer with listeners to create and destroy popups
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("CWA",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1})],
                        "styleMap": stylemap,
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size: 10px; color: black'>";
                        text = text + "<div style='background-color: #1150a0; color:white'><b>" +
                        "Center Weather Advisory</b></div>";
                        text = text + spancol + "<b>CWSU:</b> </span>" + feature.attributes.cwsu+
                        " ["+feature.attributes.name+"]<br/>";
                        text = text + spancol+"<b>Ends:</b> </span>" + feature.attributes.validTimeTo + "<br/>";
                        if( feature.attributes.hazard != undefined )
                        text = text + spancol+"<b>Hazard:</b> </span>"+ feature.attributes.hazard + "<br/>";
                        if( feature.attributes.top != undefined )
                        text = text + spancol+"<b>Top:</b> </span>"+ feature.attributes.top + " ft<br/>";
                        if( feature.attributes.base != undefined )
                            text = text + spancol+"<b>Base:</b> </span>"+ feature.attributes.base + " ft<br/>";
                        var cwa = feature.attributes.cwaText;
                        cwa = cwa.replace( /\n/g, "<br/>" );
                        text = text + "<hr style='margin:1px 0 1px 0'/>"+ cwa + "<br/>";
                        text = text + "</div>";
                        var lines = text.match(/<br\/>/g);
                        lines = (lines == null? 3: lines.length);
                        var rules = text.match(/<hr\/>/g);
                        rules = (rules == null? 0: rules.length);
                        var height = 14*(lines + 1 + rules);
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size(400,height),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "Mis":
            function Mis(options){
                var self = this;
                this.server = AWC_OpenLayers.Library.getServer();
                this.proto_opts = {};
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.all != undefined )
                        this.proto_opts['all'] = options.all;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.redraw = function(){ this.layer.redraw(); };
                var context = {
                    "getColor":
                        function(feature){
                            if( feature.attributes.misText == "" )
                                return "#888888";
                            return "#997700";
                        },
                    "getHighlightColor":
                        function(feature){
                            if( feature.attributes.misText == "" )
                                return "#BBBBBB";
                            return "#CCAA00";
                        },
                    "getSize":
                        function(feature){
                            if( feature.attributes.misText == "" )
                                return 3;
                            return 5;
                        }
                };
                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor" : "${getColor}",
                            "fillOpacity" : 0.5,
                            "strokeColor" : "${getColor}",
                            "strokeOpacity" : 1,
                            "strokeWidth" : 2,
                            "pointRadius" : "${getSize}"
                            }, {
                            "context": context }),
                        "select": new OpenLayers.Style({
                            "fillColor" : "${getHighlightColor}",
                            "strokeColor" : "${getHighlightColor}"
                            }, {
                            "context": context })
                        }
                        );
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/MisJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server+"/gis/scripts/MisJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                // create the layer with listeners to create and destroy popups
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("MIS",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1})],
                        "styleMap": stylemap,
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size: 10px; color: black'>";
                        text = text + "<div style='background-color: #1150a0; color:white'><b>Meteorological Impact Statement</b></div>";
                        text = text + spancol+"CWSU: </span><a href='/cwamis/site?id="+feature.attributes.id+"' target='homepage'>" + feature.attributes.id+" ["+feature.attributes.name+"]</a><hr style='margin:1px 0 1px 0'/>";
                        var mis = feature.attributes.misText;
                        if( mis == "" ) mis = "No active MIS";
                        mis = mis.replace( /\n/g, "<br/>" );
                        text = text + mis + "<br/></div>";
                        var lines = text.match(/<br\/>/g);
                        lines = (lines == null? 3: lines.length);
                        var rules = text.match(/<hr\/>/g);
                        rules = (rules == null? 0: rules.length);
                        var height = 14*(lines + 2 + rules);
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size(400,height),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "NWSHazard":
            function NWSHazard(options){
                var self = this;
                this.server = AWC_OpenLayers.Library.getServer();
                this.opacity = 0.5;
                this.proto_opts = {};
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.phenomena != undefined )
                        this.proto_opts['phen'] = options.phenomena;
                    if( options.phen != undefined )
                        this.proto_opts['phen'] = options.phen;
                    if( options.significance != undefined )
                        this.proto_opts['sig'] = options.significance;
                    if( options.sig != undefined )
                        this.proto_opts['sig'] = options.sig;
                    if( options.opacity != undefined )
                        this.opacity = options.opacity;
                }
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.setPhenomena = function( value ){ this.proto_opts['phen'] = value; };
                this.setSignificance = function( value ){ this.proto_opts['sig'] = value; };
                this.setOpacity = function(value){this.opacity = value;};
                this.getOpacity = function(){return this.opacity;};
                this.redraw = function(){ this.layer.redraw(); };
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/HazardJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server+"/gis/scripts/HazardJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var context = {
                    "getLabel":
                        function(feature){
                            if( feature.attributes.phenomenon == "Tornado" )
                                return "TO";
                            if( feature.attributes.phenomenon == "Severe Thunderstorm" )
                                return "TS";
                            if( feature.attributes.phenomenon == "Flood" )
                                return "FL";
                            if( feature.attributes.phenomenon == "Flash Flood" )
                                return "FF";
                            if( feature.attributes.phenomenon == "Areal Flood" )
                                return "AF";
                            if( feature.attributes.phenomenon == "Coastal Flood" )
                                return "CF";
                            if( feature.attributes.phenomenon == "Small Craft" )
                                return "SC";
                            if( feature.attributes.phenomenon == "Hazardous Seas" )
                                return "HS";
                            if( feature.attributes.phenomenon == "High Surf" )
                                return "HS";
                            if( feature.attributes.phenomenon == "Heat" )
                                return "HT";
                            if( feature.attributes.phenomenon == "Excessive Heat" )
                                return "EH";
                            if( feature.attributes.phenomenon == "Gale" )
                                return "GA";
                            if( feature.attributes.phenomenon == "High Wind" )
                                return "HW";
                            if( feature.attributes.phenomenon == "Lake Wind" )
                                return "LW";
                            if( feature.attributes.phenomenon == "Low Water" )
                                return "LO";
                            if( feature.attributes.phenomenon == "Wind" )
                                return "WN";
                            if( feature.attributes.phenomenon == "Frost" )
                                return "FR";
                            if( feature.attributes.phenomenon == "Freeze" )
                                return "FZ";
                            if( feature.attributes.phenomenon == "Winter Weather" )
                                return "WW";
                            if( feature.attributes.phenomenon == "Winter Storm" )
                                return "WS";
                            if( feature.attributes.phenomenon == "Wind Chill" )
                                return "WC";
                            if( feature.attributes.phenomenon == "Blizzard" )
                                return "BZ";
                            if( feature.attributes.phenomenon == "Ice Storm" )
                                return "IS";
                            if( feature.attributes.phenomenon == "Storm" )
                                return "ST";
                            if( feature.attributes.phenomenon == "Freezing Rain" )
                                return "ZR";
                            if( feature.attributes.phenomenon == "Lake Effect Snow" )
                                return "LS";
                            if( feature.attributes.phenomenon == "Hard Freeze" )
                                return "HF";
                            if( feature.attributes.phenomenon == "Blowing Dust" )
                                return "BD";
                            if( feature.attributes.phenomenon == "Fire Weather" )
                                return "FW";
                            if( feature.attributes.phenomenon == "Small Craft for Hazardous Seas" )
                                return "SCHS";
                            if( feature.attributes.phenomenon == "Small Craft for Winds" )
                                return "SCW";
                            if( feature.attributes.phenomenon == "Small Craft for Rough Bar" )
                                return "SCRB";
                            if( feature.attributes.phenomenon == "Marine" )
                                return "MA";
                            if( feature.attributes.phenomenon == "Dense Fog" )
                                return "DF";
                            if( feature.attributes.phenomenon == "Freezing Fog" )
                                return "ZF";
                            if( feature.attributes.phenomenon == "Freezing Spray" )
                                return "ZS";
                            if( feature.attributes.phenomenon == "Marine Dense Fog" )
                                return "MDF";
                            if( feature.attributes.phenomenon == "Air Stagnation" )
                                return "AS";
                        },
                    "getOpacity":
                        function(feature){
                            return self.opacity;
                        }
                };
                var stylemap = new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            "fillColor": "${color}",
                            "fillOpacity": "${getOpacity}",
                            "strokeColor": "${color}",
                            "strokeOpacity": 1,
                            "strokeWidth": 2,
                            "label": "${getLabel}",
                            "fontSize": "10px",
                            "fontColor": "${color}",
                            "labelOutlineColor": "white",
                            "labelOutlineWidth": 3
                            }, {
                            "context": context
                            }
                            ),
                        "select": new OpenLayers.Style({
                            "fillColor": "${color}",
                            "strokeColor": "#FF0000"
                            }, {
                            "context": context
                            }
                            )
                }
                );
                this.layer = new OpenLayers.Layer.Vector( "NWS Hazards", {
                        "projection": eproj,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": stylemap,
                        "protocol": protocol,
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white;font-weight:bold'>" +
                        feature.attributes.phenomenon + " "  +
                        feature.attributes.significance + "</div>";
                        if( feature.attributes.end == 0 )
                        text = text + spancol+"End: </span>N/A<br/>";
                        else {
                        var endstr = AWC_OpenLayers.Library.formatDate( feature.attributes.end, "%H%M UTC %d %h" );
                        text = text + spancol+"End: </span>" + endstr + "<br/>";
                        }
                        text = text + spancol+"Office: </span>" + feature.attributes.office + "<br/>";
                        var popup = new OpenLayers.Popup.Anchored("popup",
                            new OpenLayers.LonLat( centroid.x, centroid.y ),
                            new OpenLayers.Size( 200, 50 ),
                            text,
                            null,
                            true
                            );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        }
                });
            },
        "NDFDWx":
            function NDFDWx(options){
                var self = this;
                this.server = AWC_OpenLayers.Library.getServer();
		this.scale = 1;
                this.proto_opts = {
                    "density": 0};
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.density != undefined )
                        this.proto_opts['density'] = options.density;
                    if( options.fore != undefined )
                        this.proto_opts['fore'] = options.fore;
                    if( options.scale != undefined )
                        this.scale = options.scale;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                }
                this.setDensity = function( value ){ this.proto_opts['density'] = value; };
                this.getDensity = function(){ return this.proto_opts['density']; };
                this.setScale = function( value ){ this.scale = value; };
                this.getScale = function(){ return this.scale; };
                this.setFore = function( value ){ this.proto_opts['fore'] = value; };
                this.getFore = function(){ return this.proto_opts['fore']; };
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.getDate = function(){ return this.proto_opts['date']; };
                this.redraw = function(){ this.layer.redraw(); };
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/NDFDWxJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/NDFDWxJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                // Add style to features layer
                var context = {
                    "getIcon": 
                        function(feature){
			    var wx = feature.attributes.weather.replace( "+", "%2B" );
                            var icon =  self.server+"/gis/scripts/wxicon.php?code="+wx+"&color=884400";
                            icon = icon + "&scale="+self.scale;
			    return icon;
                        },
                    "getIconSize": 
                        function(feature){
                            return self.scale*20;;
                        },
                };
                var style = new OpenLayers.Style({
                        "externalGraphic": OpenLayers.Util.getImagesLocation() + "blank.gif",
                        "backgroundGraphic": '${getIcon}',
                        "backgroundWidth": "${getIconSize}",
                        "backgroundHeight": "${getIconSize}",
                        "backgroundGraphicZIndex":1,
                        "pointRadius" : 8,
                        "graphicZIndex":10,
                        "opacity": 1
                        },{
                        "context": context });

                this.layer = new OpenLayers.Layer.Vector( "Features", {
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": new OpenLayers.StyleMap(style),
                        "eventListeners":{
                        "featureselected": 
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var text = "<div style='font-size:10px'>" +
                        "<div style='background-color: #1150a0; color: white; font-weight: bold'>NDFD Weather</div>";
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        text = text + spancol+"MTime:</span> "+feature.attributes.mtime+"<br/>";
                        text = text + spancol+"Coverage:</span>"+feature.attributes.coverage+"<br/>";
                        text = text + spancol+"Weather:</span>"+feature.attributes.weather+"</div>";

                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size( 150, 50 ),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    'featureunselected':function(evt){
                        var feature = evt.feature;
                        map.removePopup(feature.popup);
                        feature.popup.destroy();
                        feature.popup = null;
                    }
                        }
                }
                );
            },
        "RAPWind":
            function RAPWind(options){
                return new AWC_OpenLayers.DataLayer.Windbarb(options);
            },
        "Windbarb":
            function Windbarb(options){
                var self = this;
                this.server = AWC_OpenLayers.Library.getServer();
		this.scale = 1;
                this.proto_opts = {
                    "model": "rap",
                    "level": "sfc",
                    "density": 0,
                    "masked": 1,
                    "fore": 0};
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.model != undefined )
                        this.proto_opts['model'] =  options.model;
                    if( options.level != undefined )
                        this.proto_opts['level'] =  options.level;
                    if( options.density != undefined )
                        this.proto_opts['density'] = options.density;
                    if( options.masked != undefined )
                        this.proto_opts['masked'] = options.masked;
                    if( options.fore != undefined )
                        this.proto_opts['fore'] = options.fore;
                    if( options.scale != undefined )
                        this.scale = options.scale;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                }
                this.setModel = function( value ){ this.proto_opts['model'] = value; };
                this.getModel = function(){ return this.proto_opts['model']; };
                this.setLevel = function( value ){ this.proto_opts['level'] = value; };
                this.getLevel = function(){ return this.proto_opts['level']; };
                this.setDensity = function( value ){ this.proto_opts['density'] = value; };
                this.getDensity = function(){ return this.proto_opts['density']; };
                this.setScale = function( value ){ this.scale = value; };
                this.getScale = function(){ return this.scale; };
                this.setFore = function( value ){ this.proto_opts['fore'] = value; };
                this.getFore = function(){ return this.proto_opts['fore']; };
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.getDate = function(){ return this.proto_opts['date']; };
                this.redraw = function(){ this.layer.redraw(); };
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/RAPWindsJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/RAPWindsJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                // Add style to features layer
                var context = {
                    "getIcon": 
                        function(feature){
                            var wdir = feature.attributes.wdir; 
                            var wspd = feature.attributes.wspd; 
			    if( wdir == 999 )
                                return self.server+"/gis/scripts/stationicon.php?cover=M";
                            var icon =  self.server+"/gis/scripts/stationicon.php?cover=S&wdir="+wdir+"&wspd="+wspd;
			    if( feature.attributes.wgust != undefined )
                                icon = icon + "&wgst="+feature.attributes.wgust;

                            icon = icon + "&scale="+self.scale;
                            return icon;
                        },
                    "getIconSize": 
                        function(feature){
                            return self.scale*80;;
                        },
                };
                var style = new OpenLayers.Style({
                        "externalGraphic": OpenLayers.Util.getImagesLocation() + "blank.gif",
                        "backgroundGraphic": '${getIcon}',
                        "backgroundWidth": "${getIconSize}",
                        "backgroundHeight": "${getIconSize}",
                        "backgroundGraphicZIndex":1,
                        "pointRadius" : 8,
                        "graphicZIndex":10,
                        "opacity": 1
                        },{
                        "context": context });

                this.layer = new OpenLayers.Layer.Vector( "Features", {
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": new OpenLayers.StyleMap(style),
                        "eventListeners":{
                        "featureselected": 
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var wdir = feature.attributes.wdir;
                        var wspd = feature.attributes.wspd;
                        var modstr = "RAP";
                        if( self.proto_opts['model'] == "ndfd" ) modstr = "NDFD";
                        var text = "<div style='font-size:10px'>" +
                        "<div style='background-color: #1150a0; color: white; font-weight: bold'>"+modstr+" Winds at "+self.proto_opts['level']+"</div>";
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        text = text + spancol+"MTime:</span> "+feature.attributes.mtime+"<br/>";
                        if( wdir == 999 ){
                        text = text + spancol+"Wind:</span> below ground";
                        } else {
                            text = text + spancol+"Dir:</span> "+wdir+"<br/>"+
                                spancol+"Speed:</span> "+wspd+" knt";
			    if( feature.attributes.wgust != undefined )
				text = text + spancol+"<br/>Gust:</span> "+feature.attributes.wgust+"knt<br/>";
                            text = text + "</div>";

                        }

                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size( 150, 60 ),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    'featureunselected':function(evt){
                        var feature = evt.feature;
                        map.removePopup(feature.popup);
                        feature.popup.destroy();
                        feature.popup = null;
                    }
                        }
                }
                );
            },
        "RAPCldLayers":
            function RAPCloudLayers(options){
                var self = this;
                this.server = AWC_OpenLayers.Library.getServer();
                this.scale = 1;
                this.labels = false;
                this.proto_opts = {
                    "model": "rap",
		    "density": "0"};
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.model != undefined )
                        this.proto_opts['model'] =  options.model;
                    if( options.scale != undefined )
                        this.scale =  options.scale;
                    if( options.density != undefined )
                        this.proto_opts['density'] =  options.density;
                    if( options.level != undefined )
                        this.proto_opts['level'] =  options.level;
                    if( options.fore != undefined )
                        this.proto_opts['fore'] = options.fore;
                    if( options.date != undefined )
                        this.proto_opts['date'] = options.date;
                    if( options.labels != undefined )
                        this.labels = options.labels;
                }
                this.setModel = function( value ){ this.proto_opts['model'] = value; };
                this.getModel = function(){ return this.proto_opts['model']; };
                this.setFore = function( value ){ this.proto_opts['fore'] = value; };
                this.getFore = function(){ return this.proto_opts['fore']; };
                this.setDensity = function( value ){ this.proto_opts['density'] = value; };
                this.getDensity = function(){ return this.proto_opts['density']; };
                this.setScale = function( value ){ this.scale = value; };
                this.getScale = function(){ return this.scale; };
                this.setDate = function( value ){ this.proto_opts['date'] = value; };
                this.getDate = function(){ return this.proto_opts['date']; };
                this.setLabel = function( value ){ this.labels = value; };
                this.getLabel = function(){ return this.labels; };
                this.redraw = function(){ this.layer.redraw(); };
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/RAPCldLayersJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/RAPCldLayersJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                // Add style to features layer
                var context = {
                    "getIcon": 
                        function(feature){
                            var icon = self.server+"/gis/scripts/stationicon.php?cover="+feature.attributes.cldcov;
			    icon = icon + "&scale="+self.scale;
			    return icon;
                        },
                    "getIconSize": 
                        function(feature){
                            return self.scale*80;;
                        },
                    "getLabel": 
                        function(feature){
                            var str = "";
                            if( self.labels == true )
                                str = feature.attributes.cldlayers.replace( /\//g, "\n");
                            return str;
                        }
                };
                var style = new OpenLayers.Style({
                        "externalGraphic": OpenLayers.Util.getImagesLocation() + "blank.gif",
                        "backgroundGraphic": '${getIcon}',
                        "backgroundWidth": "${getIconSize}",
                        "backgroundHeight": "${getIconSize}",
                        "backgroundGraphicZIndex":1,
                        "pointRadius" : 8,
                        "label": "${getLabel}",
                        "fontSize": "10px",
                        "fontColor": "#000000",
                        "labelXOffset": 0,
                        "labelYOffset": -5,
                        "labelAlign": "ct",
                        "labelOutlineColor": "white",
                        "labelOutlineWidth": 3,
                        "graphicZIndex":10,
                        "opacity": 1
                        },{
                        "context": context });

                this.layer = new OpenLayers.Layer.Vector( "Features", {
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": new OpenLayers.StyleMap(style),
                        "eventListeners":{
                        "featureselected": 
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var text = "<div style='font-size:10px'>" +
                        "<div style='background-color: #1150a0; color: white; font-weight: bold'>RAP Cloud Layers</div>";
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        //text = text + spancol+"Loc:</span> "+feature.attributes.x+","+feature.attributes.y+"["+feature.attributes.ind+"]<br/>";
                        text = text + spancol+"MTime:</span> "+feature.attributes.mtime+"<br/>";
                        var str = feature.attributes.cldlayers.replace( /\//g, " ");
                        text = text + spancol+"Clouds [MSL]:</span> "+str+"</div>";
                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size( 180, 50 ),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    'featureunselected':function(evt){
                        var feature = evt.feature;
                        map.removePopup(feature.popup);
                        feature.popup.destroy();
                        feature.popup = null;
                    }
                        }
                }
                );
            },
        "FBWind":
            function FBWind(options){
                var self = this;
                this.server = AWC_OpenLayers.Library.getServer();
                this.proto_opts = {
                    "level": 300,
                    "fore": 6};
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.level != undefined )
                        this.proto_opts['level'] =  options.level;
                    if( options.fore != undefined )
                        this.proto_opts['fore'] = options.fore;
                }
                this.setLevel = function( value ){ this.proto_opts['level'] = value; };
                this.getLevel = function(){ return this.proto_opts['level']; };
                this.setFore = function( value ){ this.proto_opts['fore'] = value; };
                this.getFore = function(){ return this.proto_opts['fore']; };
                this.redraw = function(){ this.layer.redraw(); };
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/FBWindsJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/FBWindsJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }

                // Add style to features layer
                var style = new OpenLayers.Style({
                        "externalGraphic": OpenLayers.Util.getImagesLocation() + "blank.gif",
                        "graphicZIndex": 10,
                        "backgroundGraphic": self.server+"/gis/scripts/stationicon.php?id=${id}&cover=S&wdir=${wdir}&wspd=${wspd}&temp=${temp}",
                        "backgroundWidth": 80,
                        "backgroundHeight": 80,
                        "backgroundGraphicZIndex":1,
                        "pointRadius" : 8,
                        "opacity": 1
                        });

                this.layer = new OpenLayers.Layer.Vector( "FBWind", {
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25}) ],
                        "styleMap": new OpenLayers.StyleMap(style),
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white; font-weight: bold'>FB Winds over " +
                        feature.attributes.id + "</div>";
                        text = text + spancol + "Winds:</span> "+feature.attributes.wdir+" at "+feature.attributes.wspd+" knt<br/>"+
                        spancol + "Temp:</span> "+feature.attributes.temp+" C</div>";

                        var popup = new OpenLayers.Popup.Anchored("popup",
                            new OpenLayers.LonLat( centroid.x, centroid.y ),
                            new OpenLayers.Size( 200, 50 ),
                            text,
                            null,
                            true
                            );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    'featureunselected':
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        },
                        "rendererOptions": {
                            "yOrdering": true
                        }
                }
                );
            },
        "MetarSite":
            function MetarSite(options){
                var self = this;
                this.proto_opts = {
                    "filter": 'prior'
                };
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                }
                this.redraw = function(){this.layer.redraw()};
                var style = new OpenLayers.Style({
                        "externalGraphic": OpenLayers.Util.getImagesLocation() + "blank.gif",
                        "graphicZIndex":10,
                        "backgroundGraphic": self.server+"/gis/scripts/txticon.php?text=%2B",
                        "backgroundWidth":30,
                        "backgroundHeight":30,
                        "backgroundGraphicZIndex":1,
                        "pointRadius": 8,
                        "opacity": 1
                        }
                        );
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/MetarSiteJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/MetarSiteJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("MetarSite",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": new OpenLayers.StyleMap(style),
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white; font-weight: bold'>METAR Site: " +
                        feature.attributes.id + "</div>";
                        text = text + spancol+"Name: </span>"+feature.attributes.name+"<br/>";
                        text = text + spancol+"State: </span>"+feature.attributes.state+"<br/>";
                        text = text + spancol+"Region/Cntry: </span>"+feature.attributes.region+"<br/>";
                        text = text + spancol+"Elev: </span>"+feature.attributes.elev+"m</div>";

                        var popup = new OpenLayers.Popup.Anchored("popup",
                            new OpenLayers.LonLat( centroid.x, centroid.y ),
                            new OpenLayers.Size(200,70),
                            text,
                            null,
                            true
                            );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        },
                        "rendererOptions": {
                            "yOrdering": true
                        }
                });
            },
        "RadarSite":
            function RadarSite(options){
                var self = this;
                this.proto_opts = {
                    "filter": 'prior'
                };
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                }
                this.redraw = function(){this.layer.redraw()};
                var style = new OpenLayers.Style({
                        "graphicZIndex":10,
                        "fillColor" : "#FF8800",
                        "fillOpacity" : 0.5,
                        "strokeColor" : "#FF8800",
                        "strokeOpacity" : 1,
                        "strokeWidth" : 2,
                        "pointRadius": 5,
                        "opacity": 1
                        }
                        );
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/RadarSiteJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/RadarSiteJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("RadarSite",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": new OpenLayers.StyleMap(style),
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white; font-weight: bold'>Radar Site: " +
                        feature.attributes.id + "</div>";
                        text = text + spancol+"Name: </span>"+feature.attributes.name+", "+feature.attributes.state+"<br/>";
                        text = text + "<a href=\"/radar/site?id="+feature.attributes.id+"\"><img src=\"http://radar.weather.gov/lite/NCR/"+feature.attributes.id+"_0.png\" width=\"220\"/></a></div>";

                        var popup = new OpenLayers.Popup.Anchored("popup",
                            new OpenLayers.LonLat( centroid.x, centroid.y ),
                            new OpenLayers.Size(220,240),
                            text,
                            null,
                            true
                            );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        },
                        "rendererOptions": {
                            "yOrdering": true
                        }
                });
            },
        "Airport":
            function Airport(options){
                var self = this;
                this.proto_opts = {
                    "type": 'PU'
                };
                this.icon = "nav";
                this.scale = 1;
                this.labels = false;
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.type != undefined )
                        this.proto_opts['type'] = options.type;
                    if( options.labels != undefined )
                        this.labels = options.labels;
                    if( options.icon != undefined )
                        this.icon = options.icon;
                    if( options.scale != undefined )
                        this.scale = options.scale;
                }
                this.redraw = function(){this.layer.redraw()};
                this.setType = function( value ){ this.proto_opts['type'] = value; };
                this.getType = function(){ return this.proto_opts['type']; };
                this.setLabel = function( value ){ this.labels = value; };
                this.getLabel = function(){ return this.labels; };
                this.setScale = function( value ){ this.scale = value; };
                this.getScale = function(){ return this.scale; };
                this.setIcon = function( value ){ this.icon = value; };
                this.getIcon = function(){ return this.icon; };
                // Add style to features layer
                var context = {
                    "getIcon": 
                        function(feature){
                            var param;
                            if( self.icon == "simple" )
                                return self.server+"/gis/scripts/wxicon.php?scale="+self.scale+"&code=ARP";
                            var color = "803050";
                            if( feature.attributes.tower == "T" )
                                color = "104090";
                            var rwy_hard = false;
                            if( feature.attributes.rwy_type == "C" || 
                                    feature.attributes.rwy_type == "A" ) 
                                rwy_hard = true;

                            if( feature.attributes.rwy_len == "L" && 
                                    feature.attributes.runways > 1 )
                                return self.server+"/gis/scripts/wxicon.php?scale="+self.scale+"&code=ARP-L2B&color="+color;
                            if( feature.attributes.rwy_len == "L" && 
                                    feature.attributes.runways == 1 )
                                return self.server+"/gis/scripts/wxicon.php?scale="+self.scale+"&code=ARP-L1B&color="+color;
                            if( rwy_hard && feature.attributes.rwy_len == "M" && 
                                    feature.attributes.runways > 1 && 
                                    feature.attributes.services == "S" && 
                                    feature.attributes.beacon == "B" )
                                return self.server+"/gis/scripts/wxicon.php?scale="+self.scale+"&code=ARP-M2SB&color="+color;
                            if( rwy_hard && feature.attributes.rwy_len == "M" && 
                                    feature.attributes.runways > 1 && 
                                    feature.attributes.beacon == "B" )
                                return self.server+"/gis/scripts/wxicon.php?scale="+self.scale+"&code=ARP-M2B&color="+color;
                            if( rwy_hard && feature.attributes.rwy_len == "M" && 
                                    feature.attributes.runways > 1 && 
                                    feature.attributes.services == "S" )
                                return self.server+"/gis/scripts/wxicon.php?scale="+self.scale+"&code=ARP-M2S&color="+color;
                            if( rwy_hard && feature.attributes.rwy_len == "M" && 
                                    feature.attributes.runways > 1 )
                                return self.server+"/gis/scripts/wxicon.php?scale="+self.scale+"&code=ARP-M2&color="+color;
                            if( rwy_hard && feature.attributes.rwy_len == "M" && 
                                    feature.attributes.runways == 1 && 
                                    feature.attributes.services == "S" && 
                                    feature.attributes.beacon == "B" )
                                return self.server+"/gis/scripts/wxicon.php?scale="+self.scale+"&code=ARP-M1SB&color="+color;
                            if( rwy_hard && feature.attributes.rwy_len == "M" && 
                                    feature.attributes.runways == 1 && 
                                    feature.attributes.beacon == "B" )
                                return self.server+"/gis/scripts/wxicon.php?scale="+self.scale+"&code=ARP-M1B&color="+color;
                            if( rwy_hard && feature.attributes.rwy_len == "M" && 
                                    feature.attributes.runways == 1 && 
                                    feature.attributes.services == "S" )
                                return self.server+"/gis/scripts/wxicon.php?scale="+self.scale+"&code=ARP-M1S&color="+color;
                            if( rwy_hard && feature.attributes.rwy_len == "M" && 
                                    feature.attributes.runways == 1 )
                                return self.server+"/gis/scripts/wxicon.php?scale="+self.scale+"&code=ARP-M1&color="+color;
                            if( feature.attributes.type == "ARP" &&
                                    feature.attributes.use == "R" )
                                return self.server+"/gis/scripts/wxicon.php?scale="+self.scale+"&code=ARP-R&color="+color;
                            if( feature.attributes.type == "ARP" )
                                return self.server+"/gis/scripts/wxicon.php?scale="+self.scale+"&code=ARP-S&color="+color;
                            return self.server+"/gis/scripts/wxicon.php?scale="+self.scale+"&code="+feature.attributes.type+"&color="+color;
                        },
                    "getIconSize": 
                        function(feature){
                            return self.scale*20;;
                        },
                    "getLabel": 
                        function(feature){
                            var str = "";
                            if( self.labels )
                                return feature.attributes.id;
                            return str;
                        }
                };
                var style = new OpenLayers.Style({
                        "externalGraphic": OpenLayers.Util.getImagesLocation() + "blank.gif",
                        "graphicZIndex":10,
                        "backgroundGraphic": "${getIcon}",
                        "backgroundWidth": "${getIconSize}",
                        "backgroundHeight": "${getIconSize}",
                        "backgroundGraphicZIndex":1,
                        "pointRadius": 8,
                        "label": "${getLabel}",
                        "fontSize": "10px",
                        "fontColor": "#000000",
                        "labelXOffset": -15,
                        "labelYOffset": 15,
                        "labelAlign": "ct",
                        "labelOutlineColor": "white",
                        "labelOutlineWidth": 3,
                        "opacity": 1
                        },{
                        "context": context });
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/AirportJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/AirportJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("Airport",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": new OpenLayers.StyleMap(style),
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var type = "Airport";
                        if( feature.attributes.type == "HEL" )
                        type = "Heliport";
                        if( feature.attributes.type == "SEA" )
                        type = "Seaplane";

                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white; font-weight: bold'>"+type+": " +
                        feature.attributes.id + "</div>";
                        text = text + spancol+"Name: </span>"+feature.attributes.name+"<br/>";
                        text = text + spancol+"State: </span>"+feature.attributes.state+"<br/>";
                        text = text + spancol+"Region/Cntry: </span>"+feature.attributes.region+"<br/>";
                        if( feature.attributes.icao != undefined )
                            text = text + spancol+"ICAO: </span>"+feature.attributes.icao+"<br/>";
                        var elev = Math.round(feature.attributes.elev * 3.28);
                        text = text + spancol+"Elev: </span>"+elev+"ft / "+feature.attributes.elev+"m<br/>";
                        text = text + spancol+"Mag Dev: </span>"+feature.attributes.mag_dev+"<br/>";
                        if( feature.attributes.use == "P" )
                            text = text + spancol+"Use: </span>public<br/>";
                        else if( feature.attributes.use == "M" )
                            text = text + spancol+"Use: </span>military<br/>";
                        else
                            text = text + spancol+"Use: </span>private<br/>";
                        text = text + spancol+"Runways: </span>"+feature.attributes.runways+"<br/>";
                        if( feature.attributes.rwy_len == "L" )
                            text = text + spancol+"Runway length: </span>long (&ge; 8070 feet)<br/>";
                        else if( feature.attributes.rwy_len == "M" )
                            text = text + spancol+"Runway length: </span>medium (1500 to 8069 feet)<br/>";
                        else 
                            text = text + spancol+"Runway length: </span>short (&lt; 1500 feet)<br/>";
                        if( feature.attributes.rwy_type == "H" )
                            text = text + spancol+"Runway type: </span>hard surface<br/>";
                        else if( feature.attributes.rwy_type == "C" )
                            text = text + spancol+"Runway type: </span>concrete<br/>";
                        else if( feature.attributes.rwy_type == "A" )
                            text = text + spancol+"Runway type: </span>asphalt<br/>";
                        else if( feature.attributes.rwy_type == "T" )
                            text = text + spancol+"Runway type: </span>turf<br/>";
                        else if( feature.attributes.rwy_type == "G" )
                            text = text + spancol+"Runway type: </span>gravel<br/>";
                        if( feature.attributes.services == "S" )
                            text = text + spancol+"Services: </span>yes, attended<br/>";
                        else if( feature.attributes.services == "s" )
                            text = text + spancol+"Services: </span>yes, unattended<br/>";
                        else 
                            text = text + spancol+"Services: </span>none/unknown<br/>";
                        if( feature.attributes.tower == "T" )
                            text = text + spancol+"Tower: </span>yes<br/>";
                        else
                            text = text + spancol+"Tower: </span>no<br/>";
                        if( feature.attributes.beacon == "B" )
                            text = text + spancol+"Beacon: </span>sunset-sunrise<br/>";
                        else
                            text = text + spancol+"Beacon: </span>no<br/>";
                        if( feature.attributes.traffic > 0 )
                            text = text + spancol+"Traffic: </span>"+feature.attributes.traffic+"</div>";
                        text = text + "</div>";

                        var popup = new OpenLayers.Popup.Anchored("popup",
                                new OpenLayers.LonLat( centroid.x, centroid.y ),
                                new OpenLayers.Size(240,190),
                                text,
                                null,
                                true
                                );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        },
                        "rendererOptions": {
                            "yOrdering": true
                        }
                });
            },
        "NavSite":
            function NavSite(options){
                return new AWC_OpenLayers.DataLayer.NavAids(options);
            },
        "NavAids":
            function NavAids(options){
                var self = this;
                var labels = false;
                this.proto_opts = {
                    "filter": 'prior'
                };
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.labels != undefined )
                        this.labels =  options.labels;
                }
                this.setLabel = function( value ){ this.labels = value; };
                this.getLabel = function(){ return this.labels; };
                this.redraw = function(){this.layer.redraw()};
                var context = {
                    "getIcon":
                        function(feature) {
                            var params = "";
                            if( feature.attributes.type == "VORTAC" )
                                params = params + "code=VORTAC";
                            else if( feature.attributes.type == "VOR/DME" )
                                params = params + "code=VORDME";
                            else
                                params = params + "code=VOR";
                            return self.server+'/gis/scripts/wxicon.php?'+params;
                        },
                    "getLabel": 
                        function(feature){
                            var str = "";
                            if( self.labels == true )
                                str = feature.attributes.id;
                            return str;
                        }
                }
                var style = new OpenLayers.Style({
                        "externalGraphic": OpenLayers.Util.getImagesLocation() + "blank.gif",
                        "graphicZIndex":10,
                        "backgroundGraphic": "${getIcon}",
                        "backgroundWidth": 20,
                        "backgroundHeight": 20,
                        "backgroundGraphicZIndex":1,
                        "pointRadius": 8,
                        "label": "${getLabel}",
                        "fontSize": "10px",
                        "fontColor": "#000000",
                        "labelXOffset": 20,
                        "labelYOffset": -5,
                        "labelAlign": "ct",
                        "labelOutlineColor": "white",
                        "labelOutlineWidth": 3,
                        "opacity": 1
                        },
                        { context: context }
                        );
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/NavSiteJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/NavSiteJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("NavAids",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": new OpenLayers.StyleMap(style),
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white; font-weight: bold'>NavAid: " +
                        feature.attributes.id + "</div>";
                        text = text + spancol+"Name: </span>"+feature.attributes.name+"</br>";
                        text = text + spancol+"Type: </span>"+feature.attributes.type+"</br>";
                        elev = Math.round(feature.attributes.elev*3.24);
                        text = text + spancol+"Elev: </span>"+elev+"ft<br/>";
                        text = text + spancol+"Frequency: </span>"+feature.attributes.freq+"</div>";

                        var popup = new OpenLayers.Popup.Anchored("popup",
                            new OpenLayers.LonLat( centroid.x, centroid.y ),
                            new OpenLayers.Size(200,70),
                            text,
                            null,
                            true
                            );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        },
                        "rendererOptions": {
                            "yOrdering": true
                        }
                });
            },
        "Fixes":
            function Fixes(options){
                var self = this;
                var labels = false;
                this.proto_opts = {
                    "type": 'H'
                };
                this.server = AWC_OpenLayers.Library.getServer();
                if( options != undefined ){
                    if( options.server != undefined )
                        this.server =  options.server;
                    if( options.labels != undefined )
                        this.labels =  options.labels;
                    if( options.type != undefined )
                        this.proto_opts['type'] = options.type;
                }
                this.setLabel = function( value ){ this.labels = value; };
                this.getLabel = function(){ return this.labels; };
                this.setType = function( value ){ this.proto_opts['type'] = value; };
                this.getType = function(){ return this.proto_opts['type']; };
                this.redraw = function(){this.layer.redraw()};
                var context = {
                    "getIcon":
                        function(feature) {
                            var params = "";
                            if( feature.attributes.type == "VORTAC" )
                                params = params + "code=VORTAC";
                            else if( feature.attributes.type == "VOR/DME" )
                                params = params + "code=VORDME";
                            else
                                params = params + "code=FIXN";
                            return self.server+'/gis/scripts/wxicon.php?'+params;
                        },
                    "getLabel": 
                        function(feature){
                            var str = "";
                            if( self.labels == true )
                                str = feature.attributes.id;
                            return str;
                        }
                }
                var style = new OpenLayers.Style({
                        "externalGraphic": OpenLayers.Util.getImagesLocation() + "blank.gif",
                        "graphicZIndex":10,
                        "backgroundGraphic": "${getIcon}",
                        "backgroundWidth": 20,
                        "backgroundHeight": 20,
                        "backgroundGraphicZIndex":1,
                        "pointRadius": 8,
                        "label": "${getLabel}",
                        "fontSize": "10px",
                        "fontColor": "#000000",
                        "labelXOffset": 20,
                        "labelYOffset": -5,
                        "labelAlign": "ct",
                        "labelOutlineColor": "white",
                        "labelOutlineWidth": 3,
                        "opacity": 1
                        },
                        { context: context }
                        );
                // Set up protocol
                if( this.server == "" ){
                    var protocol = new OpenLayers.Protocol.HTTP( {
                            "url": "/gis/scripts/FixSiteJSON.php",
                            "params": this.proto_opts,
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                } else {
                    var protocol = new OpenLayers.Protocol.Script( {
                            "url": this.server + "/gis/scripts/FixSiteJSON.php",
                            "params": this.proto_opts,
                            "callbackKey": "jsonp",
                            "format": new OpenLayers.Format.GeoJSON()
                            });
                }
                var eproj = new OpenLayers.Projection("EPSG:4326");
                this.layer = new OpenLayers.Layer.Vector("Fixes",{
                        "projection": eproj,
                        "protocol": protocol,
                        "strategies": [ new OpenLayers.Strategy.BBOX({resFactor:1,ratio:1.25})],
                        "styleMap": new OpenLayers.StyleMap(style),
                        "eventListeners":{
                        "featureselected":
                        function(evt){
                        var feature = evt.feature;
                        var centroid = feature.geometry.getCentroid();
                        var spancol = "<span style=\"color: #7777CC; font-weight: bold\">";
                        var text = "<div style='font-size:10px; color: black'>" +
                        "<div style='background-color: #1150a0; color: white; font-weight: bold'>Fix: " +
                        feature.attributes.id + "</div>";
                        text = text + spancol+"Type: </span>"+feature.attributes.type+"</br>";

                        var popup = new OpenLayers.Popup.Anchored("popup",
                            new OpenLayers.LonLat( centroid.x, centroid.y ),
                            new OpenLayers.Size(200,30),
                            text,
                            null,
                            true
                            );
                        feature.popup = popup;
                        map.addPopup(popup);
                        },
                    "featureunselected":
                        function(evt){
                            var feature = evt.feature;
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                        },
                        "rendererOptions": {
                            "yOrdering": true
                        }
                });
            }
    },
    "Control": {
        "locationFormat": "deg",
        "MousePosition":
            function MousePosition(options){
                if( options == undefined ) options = {};
                options['emptyString'] = "--";
                options['formatOutput'] = function(loc){
                    function pad(val){
                        if( val < 10 )
                            return "0"+val;
                        else
                            return ""+val;
                    }
                    if( AWC_OpenLayers.Control.locationFormat == "deg" )
                        var str = loc.lat.toFixed(3) + "," + loc.lon.toFixed(3);
                    else {
                        lat = Math.abs(loc.lat);
                        var l = "N";
                        if( loc.lat < 0 ) l = "S";
                        var d = Math.floor( lat );
                        var m = Math.floor((lat-d)*60);
                        var s = Math.floor(((lat-d)*60-m)*60);
                        str = ""+d+":"+pad(m)+":"+pad(s)+l+",";

                        lon = Math.abs(loc.lon);
                        var l = "E";
                        if( loc.lon < 0 ) l = "W";
                        var d = Math.floor( lon );
                        var m = Math.floor((lon-d)*60);
                        var s = Math.floor(((lon-d)*60-m)*60);
                        str = str+d+":"+pad(m)+":"+pad(s)+l;
                    }
                    return str;
                };

                return new OpenLayers.Control.MousePosition(options);
            }
    },
    "Library": {
        "metric": false,
        "searchArray":
            function(values, value){
                if( values == undefined || values == null ) return false;
                for( var i = 0; i < values.length; i++ ){
                    if( values[i] == value ) return true;
                }
                return false;
            },
        "getOptions":
            function(){
                var optionStr = document.location.search.substring(1);
                var vars = optionStr.split("&");
                var options = {};
                for( var i = 0; i < vars.length; i++ ){
                    var pair = vars[i].split("=");
                    options[pair[0]] = pair[1];
                }
                return options;
            },
        "setServer": 
            function( value ){
                AWC_OpenLayers.server = value;
            },
        "getServer":
            function(){
                var loc;
                loc = window.location.hostname;	

                if( loc.indexOf("aviationweather.gov") > 0) {
                    return "";
                } else if( loc.indexOf("ncep.noaa.gov") > 0 ) {
                    return "";
                } else if( loc.indexOf("idp-web.eee") > 0 ) {
                    return "";
                } else {
                    return AWC_OpenLayers.server;
                }
            },
        "getCookie":
            function(key){
                if( document.cookie.length == 0 ) return null;
                var data = "; " + document.cookie;
                var fields = data.split( "; " + key + "=" );
                if( fields.length == 2 ){
                    var value = fields[1].split(";").shift();
                    return value;
                }
                return null;
            },
        "setFormOption":
            function(id, value){
                var elem = document.getElementById( id );
                if( elem == null ) return;
                var opt;
                for( var i = 0; opt = elem.options[i]; i++ )
                    if( opt.value == value )
                        elem.selectedIndex = i;	
            },
        "setFormCheckbox":
            function(id, value){
                var elem = document.getElementById( id );
                if( elem == null ) return;
                elem.checked = value;
            },
        "outTemp":
            function(value){
                if( value == undefined )
                    return "-";
                if( this.metric )
                    return Math.round(value);
                else
                    return Math.round(value*9/5+32);
            },
        "outTempUnits":
            function(){
                if( this.metric )
                    return "C";
                else
                    return "F";
            },

        "outVisib":
            function(value){
                if( value == undefined )
                    return "-";
                if( this.metric ){
                    if( value == 10.00 )
                        return "16+";
                    if( value == 6.21 )
                        return "10+";
                    value = 1.6*value;
                    if( value < 3 )
                        return value.toFixed(1);
                    else
                        return value.toFixed(0);
                }
                else {
                    if( value == 10.00 )
                        return "10+";
                    if( value == 6.21 )
                        return "6+";
                    if( value < 3 )
                        return value.toFixed(1);
                    else
                        return value.toFixed(0);
                }
            },

        "outVisibUnits":
            function(){
                if( this.metric )
                    return "km";
                else
                    return "sm";
            },

        "outRelHum":
            function(t,td){
                if( t == undefined || td == undefined )
                    return "-";
                var e = 6.1078 * Math.exp(17.2693882 * td / (td + 237.3));
                var es = 6.1078 * Math.exp(17.2693882 * t / (t + 237.3));
                var rh = e/es*100;
                return Math.round(rh);
            },

        "outAltim":
            function(altim){
                if( altim == undefined )
                    return "-";
                if( this.metric )
                    altim = Math.round(altim*10)%1000;
                else
                    altim = Math.round(altim*2992/1013.25)%1000;
                altim = altim.toString();
                if( altim.length == 1 ) altim = '00'+altim;
                else if( altim.length == 2 ) altim = '0'+altim;
                return altim;
            },
        "outAltimUnits":
            function(){
                if( this.metric )
                    return "hPa";
                else
                    return "inHg";
            },

        "outAltimLong":
            function(altim){
                if( altim == undefined )
                    return "-";
                if( !this.metric )
                    altim = Math.round(altim*2992/1013.25)/100;
                return altim;
            },

        "getDate":
            function(secs){
                if( secs == null )
                    var date = new Date();
                else
                    var date = new Date( secs*1000 );
                function pad(val){
                    if( val < 10 )
                        return "0"+val;
                    else
                        return ""+val;
                }
                str = "" + date.getUTCFullYear() + pad(date.getUTCMonth()+1) +
                    pad(date.getUTCDate()) + pad(date.getUTCHours()) +
                    pad(date.getUTCMinutes());
                return str;
            },

        "formatDate":
            function(d, fmt){
                if( d == undefined )
                    d = new Date();
                else if( d instanceof Date == false )
                    d = new Date( d * 1000 );
                if( fmt == null ) fmt = "%H%M UTC %d %a %b %Y";
                function pad(val){
                    if( val < 10 )
                        return "0"+val;
                    else
                        return ""+val;
                }
                var month = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
                    "Aug", "Sep", "Oct", "Nov", "Dec" ];
                var day = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                var str = fmt.replace( /%([YmdHMShba])/g,
                        function(m0,m1){
                        if( m1 == "Y" )
                        return d.getUTCFullYear();
                        if( m1 == "m" )
                        return pad(d.getUTCMonth()+1);
                        if( m1 == "b" || m1 == "h" )
                        return month[d.getUTCMonth()];
                        if( m1 == "d" )
                        return pad(d.getUTCDate());
                        if( m1 == "a" )
                        return day[d.getUTCDay()];
                        if( m1 == "H" )
                        return pad(d.getUTCHours());
                        if( m1 == "M" )
                        return pad(d.getUTCMinutes());
                        if( m1 == "S" )
                        return pad(d.getUTCSeconds());
                        });
                return str;
            },
        "getSeconds":
            function(datestr){
                if( datestr == null ){
                    var d = new Date();
                    return Math.floor(d.getTime()/1000);
                }
                else {
                    var year = datestr.substr( 0, 4 );
                    var month = datestr.substr( 4, 2 );
                    var day = datestr.substr( 6, 2 );
                    var hour = datestr.substr( 8, 2 );
                    var minute = datestr.substr( 10, 2 );
                    var cur_date = new Date( Date.UTC(year, month-1, day, hour, minute, 0 ));
                    return cur_date.getTime()/1000;
                }
            },
        "formatCurrentDate":
            function(datestr,tz){
                var cur_date;
                if( datestr == undefined )
                    cur_date = new Date();
                else if( datestr instanceof Date )
                    cur_date = datestr;
                else if( typeof datestr == "string" ){
                    var year = datestr.substr( 0, 4 );
                    var month = datestr.substr( 4, 2 );
                    var day = datestr.substr( 6, 2 );
                    var hour = datestr.substr( 8, 2 );
                    var minute = datestr.substr( 10, 2 );
                    cur_date = new Date( Date.UTC(year, month-1, day, hour, minute, 0 ));
                }
                else
                    cur_date = new Date( datestr*1000 );

                if( tz != undefined ){
                    var tzvals = tz.split(",");
                    var local_date = new Date( cur_date.getTime() + tzvals[1]*3600000);
                }

                var month = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
                    "Aug", "Sep", "Oct", "Nov", "Dec" ];
                function pad(str){
                    if( str.length == 1 )
                        return '0'+str;
                    else
                        return str;
                }
                var datim = pad(cur_date.getUTCHours()+"") +
                    pad(cur_date.getUTCMinutes()+"") + " UTC ";
                if( tz != undefined ){
                    if( local_date.getUTCHours() > 11 )
                        var hrstr = (local_date.getUTCHours() - 12 ) + ":" +
                            pad(local_date.getUTCMinutes().toString()) + " PM ";
                    else if( local_date.getUTCHours() == 0 )
                        var hrstr = "12:" +
                            pad(local_date.getUTCMinutes().toString()) + " AM ";
                    else
                        var hrstr = local_date.getUTCHours() + ":" +
                            pad(local_date.getUTCMinutes().toString()) + " AM ";
                    datim = datim + "(" + hrstr + tzvals[0] + ") ";
                }
                datim = datim + pad(cur_date.getUTCDate()) + " " +
                    month[cur_date.getUTCMonth()] + " " +
                    cur_date.getUTCFullYear() ;
                return datim;
            }
    },
    "server": ""
};

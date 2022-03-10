
require([
        "esri/Graphic",
        "esri/tasks/GeometryService",
        "esri/tasks/support/ProjectParameters",
        "esri/geometry/SpatialReference",
        "esri/request",
        "esri/Map",
        "esri/Basemap",
        "esri/layers/TileLayer",
        "esri/layers/VectorTileLayer",
        "esri/layers/Layer",
        "esri/views/MapView",
        "esri/views/2d/layers/BaseLayerViewGL2D",
        "esri/geometry/support/webMercatorUtils",
        "addons/audubon"
      ], function (
        Graphic,
        GeometryService,
        ProjectParameters,
        SpatialReference,
        esriRequest,
        EsriMap,
        Basemap,
        TileLayer,
        VectorTileLayer,
        Layer,
        MapView,
        BaseLayerViewGL2D,
        webMercatorUtils,
        audubon
      ) {
        const MyOspreyLayerView2D = BaseLayerViewGL2D.createSubclass({
            aGraphics: [],
            constructor: async function() {
                console.log("calling fake api for location...");
                const __query_url = `
                    https://services1.arcgis.com/lDFzr3JyGEn5Eymu/ArcGIS/rest/services/mbi_individual_viz/FeatureServer/2/query?where=group_bird_type%3D%27waterbird%27&outFields=*&returnGeometry=true&f=pjson&token=HDuHlLAQtwEhm_8WN4I6VLf4RQ_oRjFMApQgk3MEX8aRTZNlBIhyh5z7BhhZAvKxTWsCQYX3AS4bsfPTVwteSbhColmHcCNzBfKIW2XrUMxGzrwpemCaiyqjbfC_nzTbiBr6moryh4zrDxSrKNoRgB9WIyGiFnYfM9g7HXv5Y1eEhhXOlnsPNyXoyS2EP45F6OQM7MV1-sH5RioWrjlOF7IhbH8-67OtrV9pJAEeqoS8n3lwZM1ol_423SU4WVcMgY1OmlXkcyTEJeQVcqrZ6A
                `;

                /* esriRequest(__query_url,
                    {
                        responseType: "json"
                    }
                    )
                    .then(async(resp) => {
                        console.log(resp);
                        let __geometries = [];

                        console.log(resp.data.features[0]);
                        console.log(resp.data.features[0].geometry.paths[0]);

                        const test_path = [
                            [-465708.0395, 3143445.3277],
                            [-465705.4386, 3143443.3046],
                            [-465705.078600001, 3143444.1778],
                            [-465705.053200001, 3143444.2395],
                            [-465704.772399999, 3143445.0078],
                            [-465705.513800001, 3143445.5612],
                            [-465706.929199999, 3143446.5403]
                        ]

                        let polyline = {
                                type: "polyline",  // autocasts as new Polyline()
                                paths: test_path //[resp.data.features[0].geometry.paths[0]]
                            };
                        __geometries.push(polyline);

                        const polylineGraphic = new Graphic({
                            geometry: polyline
                        });

                        //console.log(__geometries);
                        //let geomSer = new GeometryService("https://gispiquaoh.org/arcgis/rest/services/Utilities/Geometry/GeometryServer");
                        //let params = new ProjectParameters({
                        //    geometries: [polylineGraphic.geometry],
                        //    outSpatialReference: SpatialReference.WGS84//new SpatialReference({ wkid: 4326 })
                        //});

                        //const res_audubon2 = await geomSer.project(params); 
                        //console.log("Project response :: ", res_audubon2);
                    }) */

                //using randon paths to simulate the extent from birds path
                // issue: project this to Lambert_Azimuthal_Equal_Area
                const __paths__response = [
                    [-12389859.325291343, 6924024.550392067],
                    [-10909310.097740805, 6360130.740921428],
                    [-10457352.965120113, 3489418.1910194377]
                ];
 
                // define the path per doc
                // https://audubon-gl.s3-us-west-1.amazonaws.com/docs/classes/audubon.html#createpolygonalflock
                __paths__response.map((path) => {this.aGraphics.push({ coords: path })});         
                console.log(this.aGraphics);
            },
          attach() {
            // cal fake api
            this.audubon = new audubon.Audubon(this.context);

            this.flock3 = this.audubon.createPolygonalFlock("../img/osprey_bird_red.png", this.aGraphics, 20); // nber of bird
            this.flock3.color = [1, 1, 1, 1]; // red
            this.flock3.flap = true;

            this.line = this.audubon.createPolyline([
              { coords: [-12389859.325291343, 6924024.550392067], time: 0 },
              { coords: [-10909310.097740805, 6360130.740921428], time: 1 },
              { coords: [-10457352.965120113, 3489418.1910194377], time: 2 }
            ]);

            this.line.opacityAtCutoff = 0.5;
            this.line.width = 20;
            this.line.color = [1, 0, 0, 1]
            this.line.progress = 4;
          },

          render(renderParams) {
              //console.log(renderParams);
            const t = 2 + 3 * Math.sin(0.5 * performance.now() / 1000);      
            this.line.progress = t;

            
            const marker = this.audubon.hitTest(renderParams.state.size[0] / 2, renderParams.state.size[1] / 2);
            //console.log(marker);
            if (marker) {
              marker.color = [0, 255, 0, 1];
            }

            this.audubonRender(renderParams);
          },

          audubonRender(renderParams) {
            this.audubon.render(this, renderParams);
            this.requestRender();
          },

          onDetach() {
            this.audubon.destroy();
          }
        });

        const __query_url1 = `
                    https://services1.arcgis.com/lDFzr3JyGEn5Eymu/ArcGIS/rest/services/mbi_individual_viz/FeatureServer/2/query?where=group_bird_type%3D%27waterbird%27&outFields=*&returnGeometry=true&f=pjson&token=HDuHlLAQtwEhm_8WN4I6VLf4RQ_oRjFMApQgk3MEX8aRTZNlBIhyh5z7BhhZAvKxTWsCQYX3AS4bsfPTVwteSbhColmHcCNzBfKIW2XrUMxGzrwpemCaiyqjbfC_nzTbiBr6moryh4zrDxSrKNoRgB9WIyGiFnYfM9g7HXv5Y1eEhhXOlnsPNyXoyS2EP45F6OQM7MV1-sH5RioWrjlOF7IhbH8-67OtrV9pJAEeqoS8n3lwZM1ol_423SU4WVcMgY1OmlXkcyTEJeQVcqrZ6A
                `;
        

        const MyOspreyLayer = Layer.createSubclass({
          createLayerView(view) {
            if (view.type === "2d") {
              return new MyOspreyLayerView2D({
                view: view,
                layer: this
              });
            }
          }
        });

        const myOspreyLayer = new MyOspreyLayer();
        
        const mbiBasemap = new TileLayer({
            url: "https://tiles.arcgis.com/tiles/lDFzr3JyGEn5Eymu/arcgis/rest/services/MBI_Tinted_Hillshade_Basemap/MapServer",
            effect: "brightness(105%) opacity(40%) grayscale(50%)",
        });

        // can't get to work on this basemap (projection issue)
        var basemap = new Basemap({
            baseLayers: [mbiBasemap]
        });

        const map = new EsriMap({
          basemap: "streets-night-vector",
          layers: [myOspreyLayer]
        });

        new MapView({
          map,
          container: "viewDiv",
          center: [-83.921, 34.329],
          zoom: 4,
        });
      });
    
var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue.js!',
        curves: [1,2,3,4,5,6],
        xShifts: [0,0,0,0,0,0],
        yShifts: [0,0,0,0,0,0],
        attributes: [{"name": "x shift",
                      "jsname": "xShifts"},
                     {"name": "y shift",
                      "jsname": "yShifts"}],
        wackifyLoading: false,
        wackifyMessage: "Get ready for your dreams to come true!",
        wackifyLink: false,
        wackifyImage: false
    },
    methods: {
        drawCanvas: function() {
            var rows = 520, //height
                cols = 504, //width
                canvas = document.getElementById("myCanvas"),
                ctx = canvas.getContext("2d");

            var imgData = ctx.createImageData(cols, rows);

            var rgb = getChannels();

            for (var i = 0; i < rgb.red.length; i++) {
                        imgData.data[i*4+0]=rgb.red[i];
                        imgData.data[i*4+1]=rgb.green[i];
                        imgData.data[i*4+2]=rgb.blue[i];
                        imgData.data[i*4+3]=255;
            }
            ctx.putImageData(imgData,0,0);
        },
        wackify: function() {
            let stuff = getChannels();

            
            
            $.post("/getgif", JSON.stringify({
                "width": 504, "height": 520,
                "red": Array.from(stuff.red),
                "green": Array.from(stuff.green),
                "blue": Array.from(stuff.blue)}))
                .then((res) => {
                    console.log(res);
                    this.wackifyLink = res.link;
                    this.wackifyImage = "/static/assets/output.gif";
                });

            window.location = '#';
            this.wackifyLoading = true;
        }
    },
    mounted: function() {
        let vm = this;
        $(".slider").each(function(idx, slider) {
            noUiSlider.create(slider, {
                start: 0,
                connect: true,
                range: {
                    'min': -200,
                    'max': 200
                }
            });


            let myIdx = idx/2;
            slider.noUiSlider.on('update', function (values, handle) {
                let fa = slider.getAttribute("forattr");
                if (fa == "xShifts") {
                    Vue.set(vm.xShifts, parseInt(myIdx), parseInt(values[handle]));
                } else if (fa == "yShifts") {
                    Vue.set(vm.yShifts, parseInt(myIdx), parseInt(values[handle]));
                }
            });
        });

        $(".accordion").each(function() {
            $(this).accordion({
              collapsible: true,
              active: false
            });
        });
        this.drawCanvas();
    },
    watch: {
        xShifts: function(val) {
            val.forEach((val, idx) => {
                setXShift(idx, val);
            })

            this.drawCanvas();
        },
        yShifts: function(val) {
            val.forEach((val, idx) => {
                setYShift(idx, val);
            })

            this.drawCanvas();
            console.log("yshifts");
        }
    }
})

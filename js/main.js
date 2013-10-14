(function () {

    function traceLogo() {
        var speedFactor = 0.8;
        var pathIndex = -1;

        function createAnimationPath(svgDoc, stroke) {
            var svgNamespace = svgDoc.documentElement.namespaceURI;
            var container = svgDoc.querySelector('#animationPathContainer');

            var animPath = document.createElementNS(svgNamespace, 'path');
            animPath.setAttribute('transform', 'translate(-248.25,-259.60255)');
            animPath.style.stroke = stroke;
            animPath.style.strokeWidth = '18px';
            animPath.style.strokeLinecap = 'round';
            animPath.style.strokeLinejoin = 'round';
            animPath.style.fill = 'none';
            container.appendChild(animPath);

            return animPath;
        }

        const pathTraceNs = "http://www.in2bits.org/pathtrace";

        function startTracingNextPath(svgDoc, traceG) {
            var pathNode, path, stroke,
           	    pathAnimator,
           	    speed,          // seconds that will take going through the whole path
           	    reverse,    // go back or forward along the path
           	    startOffset,     // between 0% to 100%
                animPath;

            var isFirstPoint = true;
        	function step(point, angle){
        	    // do something every "frame" with: point.x, point.y & angle
                var seg;
                if (isFirstPoint) {
                    seg = animPath.createSVGPathSegMovetoAbs(point.x,point.y);
                    animPath.pathSegList.appendItem(seg);
                    isFirstPoint = false;
                }
                else{
                    seg = animPath.createSVGPathSegLinetoAbs(point.x, point.y);
                    animPath.pathSegList.appendItem(seg);
                }
        	}

        	function finish(){
        	    // do something when animation is done
                startTracingNextPath(svgDoc, traceG);
        	}

            pathNode = traceG.querySelectorAll('path')[++pathIndex];
            if (pathNode === undefined) {
    //            console.log('done!');
                return;
            }

            speed = pathNode.getAttributeNS(pathTraceNs, "duration") * speedFactor;
            reverse = false;
            startOffset = 0;
            stroke = pathNode.getAttributeNS(pathTraceNs, "stroke");
            path = pathNode.getAttribute('d');

            animPath = createAnimationPath(svgDoc, stroke);
            pathAnimator = new PathAnimator(path);    // initiate a new pathAnimator object
            pathAnimator.start( speed, step, reverse, startOffset, finish);
        }

    	function startTracing() {
    //		console.log('checkForContent');
    		var embed = document.querySelector('embed');
    		var svgDoc = embed.getSVGDocument();

            var gs = svgDoc.querySelectorAll('g');
            var traceG = undefined;
            for (var i = 0; i < gs.length; i++) {
                var g = gs[i];
                if (g.getAttribute('inkscape:label') == 'Trace') {
                    traceG = g;
                }
            }

            startTracingNextPath(svgDoc, traceG);
    	}

        var embed = document.getElementById('svgEmbed');
        if (embed.getSVGDocument()) {
            startTracing();
        }
        else {
            embed.addEventListener('load', startTracing);
        }
    }

    traceLogo();
})();
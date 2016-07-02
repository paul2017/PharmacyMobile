Date.prototype.yyyy_mm_dd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString();
    var dd = this.getDate().toString();

    return yyyy + '-' + (mm[1]?mm:'0'+mm[0]) + '-' + (dd[1]?dd:'0'+dd[0]);
};

var MapUtil = function() {

    var pub = {};

    pub.toRadian = function(x) {
        return x * Math.PI / 180;
    }

    pub.getDistanceBetweenPoints = function(pos1, pos2, units) {

        var earthRadius = {
            miles: 3958.8,
            km: 6371
        };

        var R = earthRadius[units || 'miles'];
        var lat1 = pos1.lat;
        var lon1 = pos1.lng;
        var lat2 = pos2.lat;
        var lon2 = pos2.lng;

        var dLat = pub.toRadian((lat2 - lat1));
        var dLon = pub.toRadian((lon2 - lon1));
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(pub.toRadian(lat1)) * Math.cos(pub.toRadian(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;

        return d;
    }

    return pub;
}();


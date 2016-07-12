var HttpLite = (function() {
  function HttpLite() {
    this.reqObj = new XMLHttpRequest();
  }

  HttpLite.prototype.req = function(reqMethod, url, cb) {
    this.reqObj.open(reqMethod, url, true);
    this.reqObj.onreadystatechange = function() {
      if (this.reqObj.readyState == 4 && this.reqObj.status == 200) {
        cb(this.reqObj.responseText);
      }
    }.bind(this);
    this.reqObj.send();
  };

  HttpLite.prototype.get = function(url, cb) {
    this.req('GET', url, cb);
  };

  return HttpLite;
}());

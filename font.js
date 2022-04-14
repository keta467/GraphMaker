async function post(userNumber) {
  //ダウンロードボタンを非表示
  document.getElementById("downloaddiv").style.display = "none";
  //作画中を表示
  document.getElementById("sakugachuu").style.display = "block";

  //値check
  var CSVDATA = getcsv(userNumber);
  if (CSVDATA.indexOf("NG") != -1) {
    //アラート
    window.alert(CSVDATA);
    //作画中を非表示
    document.getElementById("sakugachuu").style.display = "none";
    return;
  }

  var postdata;
  if (userNumber == 1) {
    //値の取得
    const piecharttype = document.getElementById("piecharttype");
    const piecharttypeselectedIndex = piecharttype.selectedIndex;
    const piecharttypestring =
      piecharttype.options[piecharttypeselectedIndex].value;

    const kakuri = document.getElementById("kakuri");
    const kakuriselectedIndex = kakuri.selectedIndex;
    const kakurinumber = kakuri.options[kakuriselectedIndex].value;

    const font = document.getElementById("font");
    const fontselectedIndex = font.selectedIndex;
    const fontstring = font.options[fontselectedIndex].value;

    const effect = document.getElementById("effect").checked;
    var effectstr = "";
    if (effect == true) {
      effectstr = "geteffect";
    } else {
      effectstr = "noeffect";
    }

    console.log("----入力された値-----");
    console.log(piecharttypestring);
    console.log(kakurinumber);
    console.log(fontstring);
    console.log(effectstr);
    console.log("---------------");
    postdata = {
      usernumber: userNumber,
      csvdata: CSVDATA,
      piecharttypestring: piecharttypestring,
      kakurinumber: kakurinumber,
      fontstring: fontstring,
      effectstr: effectstr,
    };
  } else if (
    userNumber == 2 ||
    userNumber == 3 ||
    userNumber == 4 ||
    userNumber == 5
  ) {
    postdata = {
      usernumber: userNumber,
      csvdata: CSVDATA,
    };
  }

  console.log(postdata);

  //設定エリア
  //https通信
  // var subdomain = "ec2.yuiiuy.net";
  // var port = "9001";
  var subdomain = "tozin.yuiiuy.net";
  var port = "42944";

  url = `http://${subdomain}:${port}/prism/`;

  console.log(url);

  fetch(url, {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postdata),
  })
    .then((response) => response.json())
    .then((data) => {
      // window.alert(data);
      console.log(data);
      //画像を更新
      var elem = document.getElementById("previewimage");
      elem.src = data.imageData;

      // //画像のダウンロード設定
      var imageData = data["imageData"];
      var sceneData = data["sceneData"];
      var movieData = data["movieData"];
      var svgData = data["svgData"];
      document.getElementById("download").href = imageData;
      document.getElementById("download2").href = sceneData;
      document.getElementById("download3").href = movieData;
      document.getElementById("download4").href = svgData;
      //消す
      if (movieData == "") {
        document.getElementById("download3").style.display = "none";
      } else {
        document.getElementById("download3").style.display = "block";
      }
      //消す
      if (svgData == "") {
        document.getElementById("download4").style.display = "none";
      } else {
        document.getElementById("download4").style.display = "block";
      }

      //ダウンロードボタンを表示
      document.getElementById("downloaddiv").style.display = "block";
      //作画中を非表示
      document.getElementById("sakugachuu").style.display = "none";

      console.log("作画処理完了");
    })
    .catch((e) => {
      console.log("フェッチエラー" + e);
      window.alert("エラー１");
    });
}

//jexelの内容をCSV形式で返す関数
function getcsv(userNumber) {
  // 二次元配列をCSV形式のテキストデータに変換
  var lines = [];
  for (var i = 0; i < data.length; i++) {
    lines.push(data[i].join(","));
  }
  //空欄check
  for (var i = 0; i < lines.length; i++) {
    var valueArr = lines[i].split(",");
    for (var j = 0; j < valueArr.length; j++) {
      if (valueArr[j] == "") {
        return "NG 空欄があります。";
      }
    }
  }
  if (userNumber == 1 || userNumber == 2) {
    //5列 3行 check
    var lineStrArr = lines[0].split(",");
    if (lineStrArr.length != 2) {
      return "NG 選択範囲異常";
    }

    //数値check
    for (var i = 0; i < lines.length; i++) {
      var lineStrArr = lines[i].split(",");
      if (isNumber(lineStrArr[1]) == false) {
        return "NG 数値じゃない";
      }
    }
    // 改行コードは windows を想定
    return lines.join("\r\n");
  } else if (userNumber == 3) {
    //5列 3行 check
    var lineStrArr = lines[0].split(",");
    if (lineStrArr.length != 5 || lines.length != 3) {
      return "NG 選択範囲異常";
    }

    //数値check
    for (var i = 0; i < lines.length; i++) {
      var lineStrArr = lines[i].split(",");

      if (isNumber(lineStrArr[1]) == false) {
        return "NG 数値じゃない";
      }
      if (isNumber(lineStrArr[2]) == false) {
        return "NG 数値じゃない";
      }
      if (isNumber(lineStrArr[3]) == false) {
        return "NG 数値じゃない";
      }
      if (isNumber(lineStrArr[4]) == false) {
        return "NG 数値じゃない";
      }
    }
    // 改行コードは windows を想定
    return lines.join("\r\n");
  } else if (userNumber == 4) {
    //5列 3行 check
    var lineStrArr = lines[0].split(",");
    if (lineStrArr.length != 9 || lines.length != 3) {
      return "NG 選択範囲異常";
    }

    //数値check
    for (var i = 0; i < lines.length; i++) {
      var lineStrArr = lines[i].split(",");

      if (isNumber(lineStrArr[2]) == false) {
        return "NG 数値じゃない";
      }
      if (isNumber(lineStrArr[3]) == false) {
        return "NG 数値じゃない";
      }
      if (isNumber(lineStrArr[4]) == false) {
        return "NG 数値じゃない";
      }
      if (isNumber(lineStrArr[5]) == false) {
        return "NG 数値じゃない";
      }
      if (isNumber(lineStrArr[6]) == false) {
        return "NG 数値じゃない";
      }
      if (isNumber(lineStrArr[7]) == false) {
        return "NG 数値じゃない";
      }
      if (isNumber(lineStrArr[8]) == false) {
        return "NG 数値じゃない";
      }
    }
    // 改行コードは windows を想定
    return lines.join("\r\n");
  } else if (userNumber == 5) {
    //5列 3行 check
    var lineStrArr = lines[0].split(",");
    if (lineStrArr.length != 2 || lines.length != 2) {
      return "NG 選択範囲異常";
    }

    //数値check
    for (var i = 0; i < lines.length; i++) {
      var lineStrArr = lines[i].split(",");

      if (isNumber(lineStrArr[1]) == false) {
        return "NG 数値じゃない";
      }
    }
    // 改行コードは windows を想定
    return lines.join("\r\n");
  }
}

//数字チェック関数
function isNumber(numVal) {
  // チェック条件パターン
  var pattern = /^[]?([1-9]\d*|0)(\.\d+)?$/;
  // 数値チェック
  return pattern.test(numVal);
}

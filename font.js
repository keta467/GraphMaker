async function post(userNumber) {
  //ダウンロードボタンを非表示
  document.getElementById("downloaddiv").style.display = "none";
  //作画中を表示
  document.getElementById("sakugachuu").style.display = "block";
  //プレビュー画像を非表示
  //document.getElementById("previewimage").src = "";

  var postdata;
  if (userNumber == 1) {
    //値check
    var str = getcsv();
    if (
      str == "NG 選択範囲異常" ||
      str == "NG 左が空" ||
      str == "NG 右が空" ||
      str == "NG 右が数値じゃない"
    ) {
      //アラート
      window.alert(str);
      return;
    }
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
      csvdata: getcsv(userNumber),
      piecharttypestring: piecharttypestring,
      kakurinumber: kakurinumber,
      fontstring: fontstring,
      effectstr: effectstr,
    };
  } else if (userNumber == 2 || userNumber == 3 || userNumber == 4) {
    postdata = {
      usernumber: userNumber,
      csvdata: getcsv(userNumber),
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
      "Content-Type": "application/json", // JSON形式のデータのヘッダー
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
      document.getElementById("download").href = imageData;
      document.getElementById("download2").href = sceneData;
      document.getElementById("download3").href = movieData;
      //消す
      if (movieData == "") {
        document.getElementById("download3").style.display = "none";
      } else {
        document.getElementById("download3").style.display = "block";
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
  if (userNumber == 1) {
    var values = data;
    // 二次元配列をCSV形式のテキストデータに変換
    var dataArray = [];
    for (var i = 0; i < values.length; i++) {
      dataArray.push(values[i].join(","));
    }

    var d = dataArray[0].split(",");
    if (d.length != 2) {
      console.log("NG 値が多すぎます");
      return "NG 選択範囲異常";
    }

    for (var i = 0; i < dataArray.length; i++) {
      console.log(dataArray[i]);
      var d = dataArray[i].split(",");
      if (d[0] == "") {
        console.log("NG 左が空");
        return "NG 左が空";
      }
      if (d[1] == "") {
        console.log("NG 右が空");
        return "NG 右が空";
      }
      if (isNumber(d[1]) == false) {
        console.log("NG 右が数値じゃない");
        return "NG 右が数値じゃない";
      }
    }
    return dataArray.join("\r\n"); // 改行コードは windows を想定
  } else if (userNumber == 2 || userNumber == 3 || userNumber == 4) {
    var values = data;
    // 二次元配列をCSV形式のテキストデータに変換
    var dataArray = [];
    for (var i = 0; i < values.length; i++) {
      dataArray.push(values[i].join(","));
    }

    // var d = dataArray[0].split(",");
    // if (d.length != 2) {
    //   console.log("NG 値が多すぎます");
    //   return "NG 選択範囲異常";
    // }

    // for (var i = 0; i < dataArray.length; i++) {
    //   console.log(dataArray[i]);
    //   var d = dataArray[i].split(",");
    //   if (d[0] == "") {
    //     console.log("NG 左が空");
    //     return "NG 左が空";
    //   }
    //   if (d[1] == "") {
    //     console.log("NG 右が空");
    //     return "NG 右が空";
    //   }
    //   if (isNumber(d[1]) == false) {
    //     console.log("NG 右が数値じゃない");
    //     return "NG 右が数値じゃない";
    //   }
    // }
    return dataArray.join("\r\n"); // 改行コードは windows を想定
  }
}

function isNumber(numVal) {
  // チェック条件パターン
  var pattern = /^[]?([1-9]\d*|0)(\.\d+)?$/;
  // 数値チェック
  return pattern.test(numVal);
}

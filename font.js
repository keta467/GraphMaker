async function post2() {
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

  //ダウンロードボタンを非表示
  document.getElementById("downloaddiv").style.display = "none";
  //作画中を表示
  document.getElementById("sakugachuu").style.display = "block";

  //return;
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

  let postdata = {
    csvdata: getcsv(),
    piecharttypestring: piecharttypestring,
    kakurinumber: kakurinumber,
    fontstring: fontstring,
    effectstr: effectstr,
  };

  console.log(postdata);

  //設定エリア
  //https通信
  var subdomain = "ec2.yuiiuy.net";
  var port = "9001";
  var url = `https://${subdomain}:${port}/prism/`;

  //証明書エラーのため、httpでの通信
  //subdomain = "192.168.10.110";
  port = "9001";
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

//画像を保存したい
async function post(piecharttypestring, kakurinumber, fontstring, effectstr) {
  const body = {
    //csvdata: getcsv(),
    csvdata: "Chrome,61.41\r\nInternet Explorer,11.84",
    piecharttypestring: piecharttypestring,
    kakurinumber: kakurinumber,
    fontstring: fontstring,
    effectstr: effectstr,
  };
  console.log(body);
  await fetch(encodeURI("http://tozin.yuiiuy.net:42944/prism/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      csvdata:
        "Chrome,61.41\r\nInternet Explorer,11.84\r\nFirefox,10.85\r\nEdge,4.67\r\nSafari,4.18\r\nSogou Explorer,1.64\r\nOpera,1.6",
      piecharttypestring: "default",
      kakurinumber: "0",
      fontstrings: "arial",
      effectstr: "noeffect",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("通信成功");
      console.log(data);

      if (json == "") {
        //作画中を非表示
        document.getElementById("sakugachuu").style.display = "none";
        return;
      }

      // //画像のダウンロード設定
      var imageData = json["imageData"];
      var sceneData = json["sceneData"];
      var movieData = json["movieData"];
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
      document.getElementById("downloadimage").src = imageData;
      document.getElementById("downloaddiv").style.display = "block";
      //作画中を非表示
      document.getElementById("sakugachuu").style.display = "none";
    })
    .catch((e) => console.log("フェッチエラー" + e));
}

//引数はbase64形式の文字列
function toBlob(base64) {
  var bin = atob(base64.replace(/^.*,/, ""));
  var buffer = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i);
  }
  // Blobを作成
  try {
    var blob = new Blob([buffer.buffer], {
      type: "image/png",
    });
  } catch (e) {
    return false;
  }
  return blob;
}

//スプレットシートの内容をCSV形式で返す関数
function getcsv() {
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
}

function isNumber(numVal) {
  // チェック条件パターン
  var pattern = /^[]?([1-9]\d*|0)(\.\d+)?$/;
  // 数値チェック
  return pattern.test(numVal);
}

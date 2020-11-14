// 与えられたDateオブジェクトのインスタンスの時刻が第n何曜日であるかを返す
function getDayCount(date) {
    return Math.floor((date.getDate() - 1) / 7) + 1;
}
// -> http://snowsunny.hatenablog.com/entry/2014/01/18/214751
// を参考にさせていただいました

// 指定のごみ収集曜日の前日の通知のためにトリガーする関数
function notifyTheNightBefore() {
    // LINE Messaging APIの利用のための下準備
    var ACCESS_TOKEN = 'ここにアクセストークンを入力';
    var url = 'https://api.line.me/v2/bot/message/push';
    var groupID = 'ここにグループIDを入力';
    // メッセージ本文を格納する変数
    var body = '';

    // Dateオブジェクト関連の処理の準備
    var date = new Date();
    // 特定の曜日の前日に通知するために、Dateオブジェクトのインスタンスdateの日時を１日早める
    date.setDate(date.getDate() + 1);
    var dayIndex = date.getDay()
    var day = ["日", "月", "火", "水", "木", "金", "土"][dayIndex];


    //--ゴミ出しの曜日のパターンと前日に送信するメッセージの定義--//
    //   火曜日・金曜日 ペットボトル
    if (day == '金') {
        body += '明日金曜日はペットボトルの収集日です。準備はOKですか？'
    } else if (day == '火') {
        body += '明日火曜日はペットボトルの収集日です。準備はOKですか？'
    }
    //   月曜日 缶・びん
    if (day == '月') {
        body += '明日月曜日は缶・びんの収集日です。準備はOKですか？';
    }
    //   1･3回目木曜日 プラ容器包装
    var is1stThur = (day == '木') && (getDayCount(date) == 1)
    var is3rdThur = (day == '木') && (getDayCount(date) == 3)
    if (is1stThur || is3rdThur) {
        body += '明日はプラ容器包装の収集日です。準備はOKですか？'
    }
    //   2･4回目木曜日 生活ゴミ
    var is2ndThur = (day == '木') && (getDayCount(date) == 2)
    var is4thThur = (day == '木') && (getDayCount(date) == 4)
    if (is2ndThur || is4thThur) {
        body += '明日は生活ゴミの収集日です。準備はOKですか？'
    }


    //LINE Messaging APIでの実際のグループへのメッセージ送信処理
    //現在時刻から見た明日が、何もゴミ出し日に該当しなければ、メッセージは送信されない。
    if ((day == '金') || (day == '月') || is1stThur || is3rdThur || is2ndThur || is4thThur) {

        UrlFetchApp.fetch(url, {
            'headers': {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + ACCESS_TOKEN,
            },
            'method': 'POST',
            'payload': JSON.stringify({
                'to': groupID,
                'messages': [{
                    'type': 'text',
                    'text': body,
                }]
            })
        })
    }
}


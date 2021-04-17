# 起動手順

`git clone https://github.com/kirikirisu/LibraryNet.git librarynet`

`cd librarynet`

`docker compose up -d`

### データのリストア

サンプルのdbデータ(スマプロのnotionに置いときます)を持っている人はリストアします。
まず、このREADMEと同じ階層にdatabaseフォルダを用意して、そこにbackupファイルを置いてください。

`docker compose exec db bash`

  `/usr/local/bin/pg_restore -d librarynet -U postgres /usr/src/dev-initial.backup`

### 環境変数の設定

serverフォルダ配下に.envファイルを作成し、それぞれの環境変数を設定します。

```
NODE_ENV=container

SLACK_API_KEY="Bearer xoxb-hogehoge-hogehoge-hogehoge"

CONTAINER_DATABASE_URL=postgres://postgres:postgres@librarynet_db:5432/librarynet
CONTAINER_REDIS_HOST=librarynet_redis


LOCAL_DATABASE_URL=hoge
LOCAL_REDIS_HOST=hoge
```

NODE_ENVにより環境を分けます。今回はcontainerとlocalという２つの環境を用意しました。

NODE_ENV=container -> dockerのコンテナ内で使う環境変数

NODE_ENV=container以外の値 -> それぞれのlocalの環境変数

#### この２つの環境に分けた背景

- コンテナ内でserverの起動・ソースコード変更時の再起動がすごく遅い(数十秒かかる)ため、

開発する際は普通にローカルの環境で開発したほうが開発体験がいい。

(docker導入当初から遅いことに気がつかなった、遅い原因が追えていない)

- とはいえDockerによりどんな感じのアプリなのかコマンド一つで確認できるの便利(slackの諸々設定は必要だけど)。

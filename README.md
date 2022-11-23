# React Test

이 프로젝트는 WebRTC의 양방향 통신을 구현하기 위한 테스트 파일입니다.\
해당 프로젝트의 결과물은 서로 음성만 돌리게 구현하였습니다.

## 실행 방법

[서버 세팅](https://github.com/Hyunjin-Jung/Lincall-backend) 에 가서 clone 후 실행을 합니다.\
그 상태로 npm start 를 한 후에 한명이 Client 에 들어가면 alert 로 숫자가 뜹니다.\
다른 한명은 Counselor 로 들어가서 그 숫자를 입력하면 둘이 연결되게 됩니다.

## 주의 사항
서버로 세팅한 IP 주소를 알고 있어야 서로 그 IP로 맞춰야만 돌아가게 됩니다. (localhost:8080 을 서버 ip로 바꿔야합니다.)\
같은 로컬 환경 속에 있어야만 돌아가는 상태이고 멀리 있는 사람끼리 연결하고 싶으시면 TURN SERVER 를 구축해야 합니다.\
TURN SERVER 는 coturn 을 사용하면 손쉽게 구축할 수 있습니다.

## Description
* JS File

| File Name | Description            |
|--------|--------------------
|ClientTest| Caller 랑 동일 인물, Offer 와 Room 생성하는 사람 
|CounselorTest|  Callee 랑 동일 인물, Answer 하는 사람
|First| 시작화면, onclick으로 counserlor, client 선택 가능

## Available Scripts

In the project directory, you can run:

### `npm install`

처음에 이 프로젝트를 clone 하면 npm install 을 통해 node_modules 를 설치해야 합니다.\
만약 node 도 안깔려있다면 [리엑트 시작하기](https://cocoon1787.tistory.com/771) 를 참고하시기 바랍니다.
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.



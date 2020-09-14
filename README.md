# 유저 로그인 상태 확인 (commit no 56, 57)

1. friends를 우선 받는다. - firebaseApp.listenToFriends()
2. freinds를 받고 friend개체에 isLogin: false를 추가해서 redux에 저장한다.
3. friends가 다 redux에 저장되면 isFriendsLoadDone이 true로 바뀌고, 이를 트리거로 friends들의 로그인 상태를 확인한다. - firebaseApp.listenToLoginStatus(): 로그인 시에는 isLogin: true
4. firebaseApp.listenToLoginStatus()를 통해 해당 유저가 로그아웃 할 경우 isLogin: false로 변경

- 문제: 기존의 friends 목록에 있는 friend의 loginStatus는 반영이 되지만 새로 친구를 추가할 경우 loginStatus가 반영되지 않는다.

해결: <UserPopup />에서 firebaseApp.addFriend(userID)를 호출 할때 해당 유저의 로그인 상태를 같이 체크한다 - firebaseApp.checkUserLoginStatus.
그리고 여기서 dispatch를 통해 redux의 friends들 중 해당 유저의 isLogin state를 수정한다.

import { FriendshipConstants } from '../constants';

export const filteredNonFriendshipsFromUsers = (
  keyword,
  users,
  friendships,
) => {
  var filteredUsers = users;
  if (keyword && keyword.length > 0) {
    filteredUsers = users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`;
      // if (user.preferredName) {
      //   fullName = `${user.preferredName} ${user.lastName}`;
      // } else {
      //   fullName = `${user.firstName} ${user.lastName}`;
      // }
      fullName && fullName.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
      return (
        fullName.startsWith(keyword)
      );
    });
  }
  if (friendships) {
    filteredUsers = filteredUsers.filter(
      (user) => !friendships.find((friendship) => friendship.user.id == user.id),
    );
  }
  return filteredUsers.map((user) => {
    return {
      user: user,
      type: FriendshipConstants.FriendshipType.none,
    };
  });
};

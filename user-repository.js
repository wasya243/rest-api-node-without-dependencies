let users = [
    {id: 1, firstName: "first1", lastName: "last1", email: "abc@gmail.com"},
    {id: 2, firstName: "first2", lastName: "last2", email: "abc@gmail.com"},
    {id: 3, firstName: "first3", lastName: "last3", email: "abc@gmail.com"},
    {id: 4, firstName: "first4", lastName: "last4", email: "abc@gmail.com"}
];

class UserRepository {

    getUsers() {
        return users;
    }

    saveUser(user) {
        const numberOfUsers = users.length;
        user['id'] = numberOfUsers + 1;
        users.push(user);
    }

    deleteUser(id) {
        const numberOfUsers = users.length;
        users = users.filter(user => user.id !== id);

        return users.length !== numberOfUsers;
    }

    updateUser(id, userData) {
        const [userToUpdate] = users.filter(user => user.id === id);

        if (!userToUpdate) {
            return false;
        } else {
            users = users.map(usr => {
                if (usr.id === id) {
                    usr = {id: usr.id, ...userData};
                }

                return usr;
            })
        }

        return true;
    }

}

module.exports = new UserRepository();
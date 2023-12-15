module.exports = class UserDto {
    id;
    name;
    email;
    login;
    roleId;
    createdAt;
    avatar;

    constructor(data) {
        this.id = data.id
        this.login = data.login
        this.roleId = data.role_id
        this.name = data.name
        this.email = data.email
        this.createdAt = data.created_at
        this.avatar = data.avatar
    }
}

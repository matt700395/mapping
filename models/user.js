const Sequelize = require('sequelize');

class User extends Sequelize.Model {

    // 스태틱 메소드
    // 테이블에 대한 설정
    static init(sequelize) {

        return super.init({ // 첫번째 객체 인수는 테이블 필드에 대한 설정
                id: {
                    comment: "아이디",
                    type: DataTypes.STRING(20),
                    primaryKey: true,
                    allowNull: false,
                    unique: true,
                },
                nickname: {
                    comment: "닉네임",
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                password: {
                    comment: "비밀번호",
                    type: DataTypes.STRING(60),
                    allowNull: false,
                },
                email: {
                    comment: "이메일",
                    type: DataTypes.STRING(100),
                    validate: {
                        isEmail: true,
                    }
                }
            },

            { // 두번째 객체 인수는 테이블 자체에 대한 설정
                sequelize,
                /* static init 메서드의 매개변수와 연결되는 옵션으로, db.sequelize 객체를 넣어야 한다. */
                timestamps: false,
                /* true : 각각 레코드가 생성, 수정될 때의 시간이 자동으로 입력된다. */
                underscored: false,
                /* 카멜 표기법을 스네이크 표기법으로 바꾸는 옵션 */
                modelName: 'User',
                /* 모델 이름을 설정. */
                tableName: 'users',
                /* 데이터베이스의 테이블 이름. */
                paranoid: false,
                /* true : deletedAt이라는 컬럼이 생기고 지운 시각이 기록된다. */
                charset: 'utf8',
                /* 인코딩 */
                collate: 'utf8_general_ci'
            });
    }

    // 다른 모델과의 관계
    static associate(db) { // 인자로 index.js에서 만든 여러 테이블이 저장되어있는 db객체를 받을 것이다.

        db.User.hasMany(db.Article, {
            foreignKey: 'commenter',
            sourceKey: 'id',
            onDelete: 'cascade',
            onUpdate: 'cascade'
        });
        // db.User (hasMany) db.article = 1:N 관계 이다.  

        db.User.belongsToMany(db.Place, {
            through: 'like'
        });
        //User와 N:M 관계. 새로운 모델인 like가 생성된다.

    }
};

module.exports = User;
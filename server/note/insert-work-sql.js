/**
 * Created by fujunou on 2015/4/12.
 */

var names = ['张三', '李四', '王五', '小六'];
var work, i, userId;
for(i = 0; i < 100; i++) {
    userId = Math.floor(Math.random() * 4);
    work = {
        name: names[userId]+'的作品'+i,
        wor_data:{index:i},
        is_delete: (i % 5 === 0 ? '0' :'1'),
        update_time: new Date() * 1,
        user_id: 'ID_USER_'+userId
    };

    db.works.insert(work);
}
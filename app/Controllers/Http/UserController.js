'use strict'

const Database = use('Database');

class UserController {

    async login({ session, request, response }){
        const {username, password} = request.all();
        const res = await Database.raw("SELECT * FROM users WHERE username = '"+username+"' AND password = md5('"+password+"') LIMIT 1");
        const user = res[0];
        
        if(user[0]){
            session.put('uid', user[0].user_id);
            session.put('username', user[0].name);
            response.redirect('/dashboard');
        } else {
            response.redirect('/');
        }
    }
    
    async store({request,response}){
        const req = request.all();
       
       let query = "INSERT INTO `users`(`user_id`, `name`, `username`, `email`, `mobile`, `password`, `status`, `created_at`, `updated_at`)";
            query += "VALUES ('"+req.name+"','"+req.username+"','"+req.email+"','"+req.mobile+"',md5('"+req.password+"'),'active','"+this.getDateTime()+"','"+this.getDateTime()+"')";
            
        const res = await Database.raw(query);
        response.send(res);
    }

    async logout({ session,response }){
        const username = session.forget('username');
        const uid = session.forget('uid');
        if(username === '' && uid === '' ){
            return response.redirect('/');
        }
       
    }

    getDateTime(){
        var d = new Date();

        const datestring = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" +d.getDate()+" "+
                            d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        return datestring;
    }

    getDate(){
        var d = new Date();

        const datestring = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" +d.getDate();
        return datestring;
    }
}

module.exports = UserController

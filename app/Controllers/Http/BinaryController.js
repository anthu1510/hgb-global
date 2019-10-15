'use strict'

const Database = use('Database');

class BinaryController {

    async bussinessdevelopmentbounus({view}){
        return view.render('dashboard/bussiness-development-bouns/list');
    }

    async binarytreelist({view}){
        return view.render('dashboard/binary/binary-tree');
    }

    async listsuperbinary({view}){
        const bonus = await Database.raw("SELECT id,match_bounus,match_pv,left_pv,right_pv,left_val,right_val,DATE(created_at) AS date FROM team_grouth_bonus");
        return view.render('dashboard/super-binary/list',{superbinary: bonus[0]});
    }

     async bdb({ response, session }) {
       
       //const details = await Database.raw("SELECT bdb.* FROM users u JOIN user_package up ON u.user_id = up.user_id"+
       //" JOIN package p ON p.id = up.package_id JOIN buss_dev_bonus bdb ON bdb.id = p.id");
       
      const t = session.get('username');
      
        
       response.send(t);
    }

    async superbinary({ response, session}){
       ;
        const pv = '5000';
       const logid =  session.get('uid');
       let rootid = '';
       const getrootid = await Database.from('binary_search_tree').select('root_id').where('user_id', logid).first();

       const today = this.getDate();

       if(getrootid.root_id !== null){
        rootid = getrootid.root_id;
       } else {
        rootid = logid;
       }

       const leftTotal = await Database.raw("SELECT sum(p.act_amount) AS lefttotal FROM user_package up JOIN users u ON up.user_id = u.user_id"+
       " JOIN package p ON  p.id = up.package_id JOIN binary_search_tree bst ON bst.user_id = u.user_id"+
       " WHERE bst.op >= '"+rootid+"' AND bst.root_id = '"+rootid+"' AND bst.leftof != 0 AND bst.created_at LIKE '"+today+"%'");

       const rightTotal = await Database.raw("SELECT sum(p.act_amount) AS righttotal FROM user_package up JOIN users u ON up.user_id = u.user_id"+
       " JOIN package p ON  p.id = up.package_id JOIN binary_search_tree bst ON bst.user_id = u.user_id"+
       " WHERE bst.op >= '"+rootid+"' AND bst.root_id = '"+rootid+"' AND bst.rightof != 0 AND bst.created_at LIKE '"+today+"%'");

       const [left, right] = [leftTotal[0],rightTotal[0]];
       const [totleft,totright] = [left[0].lefttotal,right[0].righttotal];

       const lefteast = totleft/pv;
       const righteast = totright/pv;

       const [leftcount, rightcount] = [lefteast,righteast];
   
       let pv_val = '';
       if(leftcount === rightcount){
           pv_val = leftcount;
       } else if (leftcount >= rightcount) {
           pv_val = rightcount;
       } else if (leftcount <= rightcount) {
           pv_val = leftcount;
       }  
       
       const pv_match = await Database.from('team_grouth_pv_match')
                       .where('match_ponit', '<=', pv_val)
                       .orderBy('id', 'desc')
                       .first();

       const bouns_data = {
            id: null,
            user_id: logid,
            match_pv: pv_match.match_pv,
            left_val: totleft,
            right_val: totright,
            left_pv: leftcount,
            right_pv: rightcount,
            match_bounus: pv_match.bonus,
            created_at: this.getDateTime(),
            updated_at: this.getDateTime()
       };

       const team_grouth_bonus = await Database.from('team_grouth_bonus').insert(bouns_data);

       response.send(team_grouth_bonus);

    }

    async binarytree({request,response}){
        const pv = '5000';
       const logid = '4';
       let rootid = '';
       const getrootid = await Database.from('binary_search_tree').select('root_id').where('user_id', logid).first();

       const today = this.getDate();
       console.log(today);

       if(getrootid.root_id !== null){
        rootid = getrootid.root_id;
       } else {
        rootid = logid;
       }

       const leftTotal = await Database.raw("SELECT sum(p.act_amount) AS lefttotal FROM user_package up JOIN users u ON up.user_id = u.user_id"+
       " JOIN package p ON  p.id = up.package_id JOIN binary_search_tree bst ON bst.user_id = u.user_id"+
       " WHERE bst.op >= '"+rootid+"' AND bst.root_id = '"+rootid+"' AND bst.leftof != 0 AND bst.created_at LIKE '"+today+"%'");

       const rightTotal = await Database.raw("SELECT sum(p.act_amount) AS righttotal FROM user_package up JOIN users u ON up.user_id = u.user_id"+
       " JOIN package p ON  p.id = up.package_id JOIN binary_search_tree bst ON bst.user_id = u.user_id"+
       " WHERE bst.op >= '"+rootid+"' AND bst.root_id = '"+rootid+"' AND bst.rightof != 0 AND bst.created_at LIKE '"+today+"%'");

       const [left, right] = [leftTotal[0],rightTotal[0]];
       const [totleft,totright] = [left[0].lefttotal,right[0].righttotal];

       const lefteast = totleft/pv;
       const righteast = totright/pv;

       const [leftcount, rightcount] = [lefteast,righteast];
   
       let pv_val = '';
       if(leftcount === rightcount){
           pv_val = leftcount;
       } else if (leftcount >= rightcount) {
           pv_val = rightcount;
       } else if (leftcount <= rightcount) {
           pv_val = leftcount;
       }  
       
       const pv_match = await Database.from('team_grouth_pv_match')
                       .where('match_ponit', '<=', pv_val)
                       .orderBy('id', 'desc')
                       .first();
       response.send(pv_match);

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

module.exports = BinaryController

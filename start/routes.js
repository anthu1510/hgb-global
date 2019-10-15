'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('common/login');
Route.on('/signup').render('common/signup');
Route.on('/forgot').render('common/forgot-password');
Route.get('/logout','UserController.logout');

Route.post('/store','UserController.store');
Route.post('/login','UserController.login');

//test
Route.get('/tree','BinaryController.superbinary');
Route.get('/bdb','BinaryController.bdb');



Route.group(() => {
    Route.get('/dashboard','BinaryController.listsuperbinary');

    Route.get('/dashboard/bdb','BinaryController.bussinessdevelopmentbounus');

    Route.get('/dashboard/binarytree','BinaryController.binarytreelist');
   
}).middleware(['authlog']);


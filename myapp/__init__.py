from flask import *
from myapp.db_other import get_db,query_db,check_ext,img_resize
#from config import myconfig
SECRET_KEY='\xea_&\x12%\\xea_&\x12%\xeaH\x88\xc3\x16xeaH\xea_&\x12%\xeaH\x88\xc3\x16\x88\xc3\x16'
ALLOWED_EXTENSIONS=set(['png','jpg','jpeg','gif'])
UPLOAD_FOLDER='C:\\Users\\mehrab alam\\Google Drive\\project_lab\\static\\image\\upload\\'
def creating_app():
		app=Flask(__name__)
		app.config.from_object(__name__)

		@app.teardown_request
		def close_db(exception):
			""" close database at the end of request"""
			if getattr(g,'conn',None):
				g.conn.close()
		@app.before_request
		def before_request():
			if 'user' in session:
				if session['type']=='rest':
					try:
						r=query_db('select email,name,r_area,city,mobile_no,r_image,r_id from rest_user where email =%s',[session['user']])
						if r:
							for i in r:
								g.user=i
								break
					except:
						pass
				else:
					try:
						r= query_db('select email,name,street,city,mobile_no,image from r_users where email = %s',[session['user']])
						if r:
							for i in r:
								g.user=i
								break
					except:
						pass
		@app.errorhandler(405)
		def page_not_found(e):
			return render_template('oops.html'), 405

		@app.errorhandler(404)
		def page_not_found(e):
				return render_template('oops.html'), 404

		""" Blueprint register"""

		from myapp.pyfiles_main.cart_order import cartorder
		from myapp.pyfiles_main.errors import error
		from myapp.pyfiles_main.home import h
		from myapp.pyfiles_main.profile import profile
		from myapp.pyfiles_main.reviews_contact import contactreviews 
		from myapp.pyfiles_main.checking_user_rest import userrest

		app.register_blueprint(cartorder)
		app.register_blueprint(error)
		app.register_blueprint(h)
		app.register_blueprint(profile)
		app.register_blueprint(contactreviews)
		app.register_blueprint(userrest)

		return app
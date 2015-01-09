from flask import *
from myapp.db_other import get_db,query_db,check_ext,img_resize

error=Blueprint('error',__name__)

@error.errorhandler(405)
def page_not_found(e):
	return render_template('oops.html'), 405

@error.errorhandler(404)
def page_not_found(e):
		return render_template('oops.html'), 404
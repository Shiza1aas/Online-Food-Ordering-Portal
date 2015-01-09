import pymysql
from PIL import Image
from flask import g
# database connection

def get_db():   
	if not hasattr(g,'conn'):
		g.conn=pymysql.connect(host='127.0.0.1', port=3306, user='root', passwd='', db='labproject')
	return g.conn

# query processing

def query_db(query,args=()): 
	r=get_db().cursor()
	r.execute(query,args)
	if r:
		return r
	else:
		return None

# file extension checking

def check_ext(filename): 
	if '.' in filename:
		ext=(filename.rsplit('.',1)[1]).lower()
		if ext in app.config['ALLOWED_EXTENSIONS']:
			return ext
		else:
			return None
	return None

#resize image

def img_resize(im): 
	im=os.path.join(app.config['UPLOAD_FOLDER']+im)
	image=Image.open(im)
	image.thumbnail((200,200),Image.ANTIALIAS)
	image.save(im)

import datetime
from flask import *
from myapp.db_other import get_db,query_db,check_ext,img_resize

contactreviews=Blueprint('contactreviews',__name__)

@contactreviews.route('/reviews/',methods=['POST'])
def reviews():
		j=request.get_json()
		if j['w']=='default':
			tmp=datetime.datetime.now().strftime('%d-%m-%Y@%H:%M:%S')
			try:
				r=get_db()
				rr=r.cursor()
				rr.execute('insert into reviews (email,name,image,re_text,r_id,tm) values(%s,%s,%s,%s,%s,%s)',[str(g.user[0]),str(g.user[1]),str(g.user[5]),str(j['t']),int(session['r_id']),str(tmp)])
				r.commit()
				return jsonify({'s':'1'})
			except:
				return jsonify({'s':'0'})
		elif j['w']=='cnf':
			try:
				r=get_db()
				rr=r.cursor()
				rr.execute('update reviews set status=%s where re_id=%s',[1,int(j['reid'])])
				r.commit()
				return jsonify({'s':'1'})
			except:
				return jsonify({'s':'0'})
		elif j['w']=='delt':
			try:
				r=get_db()
				rr=r.cursor()
				rr.execute('delete from reviews where re_id=%s',[int(j['reid'])])
				r.commit()
				return jsonify({'s':'1'})
			except:
				return jsonify({'s':'0'})
@contactreviews.route('/contactus/',methods=['POST'])
def contactus():
	j=request.get_json()
	if j['w']=='delme':
		try:
			r=get_db()
			rr=r.cursor()
			rr.execute('delete from contact_us where c_id=%s',[int(j['cid'])])
			r.commit()
			return jsonify({'s':'1'})
		except:
			return jsonify({'s':'0'})
	elif j['w']=='addme':
		try:
			tmp=datetime.datetime.now().strftime('%d-%m-%Y@%H:%M:%S')
			r=get_db()
			rr=r.cursor()
			rr.execute('insert into contact_us (name,email,mobile,mess,tm) values(%s,%s,%s,%s,%s)',[str(j['n']),str(j['e']),str(j['m']),str(j['msg']),str(tmp)])
			r.commit()
			return jsonify({'s':'1'})
		except:
			return jsonify({'s':'0'})

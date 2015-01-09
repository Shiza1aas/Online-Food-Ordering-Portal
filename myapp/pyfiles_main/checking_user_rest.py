from werkzeug import generate_password_hash,check_password_hash,secure_filename
import re
from flask import *
from myapp.db_other import get_db,query_db,check_ext,img_resize

userrest=Blueprint('userrest',__name__)

@userrest.route('/login_cking/pass_ing_pass/',methods=['POST'])
@userrest.route('/login_cking/',methods=['POST'])
def login_cking():
	if 'user' in session:
		j=request.get_json()
		if j['c']=='old':
			if session['type']!='rest':
				r=query_db('select password from r_users where email= %s',[session['user']])
				d=r.fetchone()
			elif session['type']=='rest':
				r=query_db('select r_password from rest_user where email= %s',[session['user']])
				d=r.fetchone()
			if(check_password_hash(d[0],j['p'])):
					return jsonify({"s":"1"})
			else:
					return jsonify({"s":"0"})
		elif j['c']=='new':	
				if session['type']!='rest':
					try:
						r=get_db()
						rr=r.cursor()
						rr.execute('update r_users set password=%s where email=%s',[generate_password_hash(j['p']),session['user']])
						r.commit()
						return jsonify({"s":"1"})
					except:
						return jsonify({"s":"0"})
				elif session['type']=='rest':
					try:
						r=get_db()
						rr=r.cursor()
						rr.execute('update rest_user set r_password=%s where email=%s',[generate_password_hash(j['p']),session['user']])
						r.commit()
						return jsonify({"s":"1"})
					except:
						return jsonify({"s":"0"})
	j=request.get_json()
	if(j['l']=='us'):
			r=query_db("select password from r_users where email= %s ",[str(j['e'])])
			d=r.fetchone()
			if(d is None):
				return jsonify({"s":"0"})
			else:
				if(check_password_hash(d[0],j['p'])):
					if(str(j['e'])=='Type admin email'):
						session['type']='spl'
					else:
						session['type']='gen'
					session['user']=str(j['e'])
					return jsonify({"s":"1"})
				else:
					return jsonify({"s":"2"})
	else:
			r=query_db("select r_password from rest_user where email= %s ",[str(j['e'])])
			d=r.fetchone()
			if(d is None):
				return jsonify({"s":"0"})
			else:
				if(check_password_hash(d[0],j['p'])):
					session['user']=str(j['e'])
					session['type']='rest'
					return jsonify({"s":"1"})
				else:
					return jsonify({"s":"2"})

@userrest.route('/signup_cking/',methods=['POST'])
def signup_cking():
	j=request.get_json()
	r=query_db("select count(*) from all_email where email=%s",[str(j['e']).lower()])
	d=r.fetchone()
	if(d[0]==0):
		r=get_db()
		rr=r.cursor()
		rr.execute('insert into all_email (email) values(%s)',[str(j['e']).lower()])
		rr.execute("insert into r_users (email,name,password) values(%s,%s,%s)",[j['e'],j['n'],generate_password_hash(j['p'])])
		r.commit()
		session['user']=str(j['e'])
		session['type']='gen'
		return jsonify({"s":"1"})
	else:
		return jsonify({"s":"0"})

@userrest.route('/rest_user_cking/',methods=['POST'])
def rest_user_cking():
	j=request.get_json()
	r=query_db("select count(*) from all_email where email=%s ",[str(j['e']).lower()])
	d=r.fetchone()
	if(d[0]==0):
		r_src=((re.sub('[ .,\-\@\_\&()]','',j['r_n']))+(re.sub('[ .,\-\@\_\&()]','',j['ar']))+(re.sub('[ .,\-\@\_\&()]','',j['cit']))).lower()
		r=get_db()
		rr=r.cursor()
		rr.execute('insert into all_email (email) values(%s)',[str(j['e']).lower()])
		rr.execute("insert into rest_user (r_search,email,name,city,r_area,mobile_no,r_password) values(%s,%s,%s,%s,%s,%s,%s)",[str(r_src),str(j['e']).lower(),str(j['r_n']),str(j['cit']),str(j['ar']),str(j['ph']),generate_password_hash(j['pa'])])
		r.commit()
		session['user']=str(j['e'])
		session['type']='rest'
		return jsonify({'r':'1'});
	else:
		return jsonify({'r':'0'});

@userrest.route('/deleteuserrest/',methods=['POST'])
def delete_user_rest():
	j=request.get_json()
	if j['t']=='u':
		try:
			r=get_db()
			rr=r.cursor()
			rr.execute('delete from r_users where email=%s',[str(j['e'])])
			r.commit()
			return jsonify({'s':'1'})
		except:
			return jsonify({'s':'1'})
	elif j['t']=='r':
		try:
			r=get_db()
			rr=r.cursor()
			rr.execute('delete from rest_user where email=%s',[str(j['e'])])
			r.commit()
			return jsonify({'s':'1'})
		except:
			return jsonify({'s':'1'})

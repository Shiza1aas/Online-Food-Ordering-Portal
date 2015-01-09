from hashlib import md5
import os
from flask import *
from myapp.db_other import get_db,query_db,check_ext,img_resize

profile=Blueprint('profile',__name__)

@profile.route('/profile/<general>/',methods=['POST'])
@profile.route('/profile/',methods=['POST','GET'])
def pro(general=None):
	if general:
		try:
			j=request.get_json()
			r=get_db()
			rr=r.cursor()
			rr.execute('update r_users set street=%s,city=%s,mobile_no=%s where email=%s',[str(j['s']),str(j['c']),str(j['m']),str(session['user'])])
			r.commit()
			return jsonify({'s':'1'})
		except:
			return jsonify({'s':'0'})
	if request.method=='GET':
		if 'user' not in session:
			return redirect(url_for('home'))
	if 'count' in session:
		if int(session['count'])>0:
			g.cart=session['cart_addr']
			g.count=session['count']
	if session['type']=='gen':
		r=query_db('select r.ro_id,r.addr,a.ord from rest_order_history as r,store_rest_orders as a,user_order_history as u where r.ro_id=a.ro_id and r.ro_id=u.ro_id and u.email=%s order by r.ro_id desc',[str(session['user'])])
		if r:
			ord_ht=r.fetchall()
			ord_hist=[]
			dm=[]
			s=' '
			for i in range(0,len(ord_ht)+1):
				#print(ord_ht[i][0],end='\n')
				if len(ord_ht)==i:
					dm.append(s)
					ord_hist.append(dm)
					break
				if i==0:
					dm.append(ord_ht[i][1])
					s=s+ord_ht[i][2]+'   '
				elif ord_ht[i][0]==ord_ht[i-1][0]:
					s=s+ord_ht[i][2]+'   '
				else:
					dm.append(s)
					ord_hist.append(dm)
					s='  '
					dm=[]
					dm.append(ord_ht[i][1])
					s=s+ord_ht[i][2]+'  '
			if not ord_hist:
				ord_hist='no'
		else:
			ord_hist='no'
	if session['type']=='rest':
		r=query_db('select r.ro_id,r.addr,a.ord,r.d_status from rest_order_history as r,store_rest_orders as a,user_order_history as u where r.ro_id=a.ro_id and r.ro_id=u.ro_id and r.r_id=%s order by r.ro_id desc;',[int(g.user[6])])
		if r:
			ord_ht=r.fetchall()
			ord_hist=[]
			dm=[]
			s=' '
			try:
				for i in range(0,len(ord_ht)+1):
					if len(ord_ht)==i:
						dm.append(s)
						dm.append(ord_ht[i-1][3])
						dm.append(ord_ht[i-1][0])
						ord_hist.append(dm)
						break
					if i==0:
						dm.append(ord_ht[i][1])
						s=s+ord_ht[i][2]+'   '
					elif ord_ht[i][0]==ord_ht[i-1][0]:
						s=s+ord_ht[i][2]+'   '
					else:
						dm.append(s)
						dm.append(ord_ht[i-1][3])
						dm.append(ord_ht[i-1][0])
						ord_hist.append(dm)
						s='  '
						dm=[]
						dm.append(ord_ht[i][1])
						s=s+ord_ht[i][2]+'  '
			except:
					ord_hist='no'
			try:
				prod=query_db('select p_name,p_type,p_price,p_id from products where  r_id=%s',[int(g.user[6])])
				rev=query_db('select name,re_text,image,tm from reviews where r_id=%s and status=%s order by re_id desc',[int(g.user[6]),1])
				if rev:
					review=rev.fetchall()
				else:
					review=None
				if prod:
					products=prod.fetchall()
				else:
					products=None
			except:
				review=None
	if session['type']=='spl':
		try:
			u_data=query_db('select email,name,street,city,mobile_no from r_users')
			r_data=query_db('select email,name,r_area,city,mobile_no from rest_user')
			rev=query_db('select name,re_text,image,tm,re_id,email,status from reviews order by status')
			con_us=query_db('select * from contact_us order by c_id desc')
			if con_us:
				contact=con_us.fetchall()
				print(contact)
			else:
				contact=None
			if rev:
				review=rev.fetchall()
			else:
				review=None
			if u_data:
				u_datauser=u_data.fetchall()
			else:
				u_datauser=None
			if r_data:
				r_datauser=r_data.fetchall()
			else:
				r_datauser=None
		except:
			u_datauser=None
			contact=None
			r_datauser=None
			review=None
			print('i am here')
	if request.method=="POST":
			file=request.files['pro_pic']
			if file:
				ext=check_ext(file.filename)
				if ext!=None:
					filename=secure_filename(file.filename)
					filename=md5((filename).encode('utf-8')).hexdigest()+'.'+ext
					r=get_db()
					rr=r.cursor()
					if session['type']!='rest':
						rr.execute('update r_users set image=%s where email=%s',[filename,session['user']])
					elif session['type']=='rest':
						rr.execute('update rest_user set r_image=%s where email=%s',[filename,session['user']])
					r.commit()
					file.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
					img_resize(filename)
					flash("Successfully done!! Reload to change")
					err='No'
					return redirect(url_for('profile'))
				err='Sorry,File format not allowed !!!'
				return render_template('profile.html',err=err,ord_hist=ord_hist)
			err='Something Wrong !!'
			return render_template('profile.html',err=err,ord_hist=ord_hist)
	if session['type']=='rest':
		return render_template('profile.html',typ=session['type'],ord_hist=ord_hist,review=review,products=products)
	if session['type']=='spl':
			return render_template('profile.html',typ=session['type'],u_datauser=u_datauser,r_datauser=r_datauser,review=review,contact=contact)		
	return render_template('profile.html',typ=session['type'],ord_hist=ord_hist)


@profile.route('/upload_menu_item/',methods=['POST'])
def upload_menu_item():
	try:
		j=request.get_json()
		r=get_db()
		rr=r.cursor()
		if j['w']=='add':
			rr.execute('insert into products (r_id,p_name,p_type,p_price) values(%s,%s,%s,%s)',[g.user[6],j['m'],j['t'],j['p']])
		else:
			rr.execute('delete from products where p_id=%s',[int(j['i'])])
		r.commit()
		return jsonify({'s':'1'})
	except:
		return jsonify({'s':'0'})

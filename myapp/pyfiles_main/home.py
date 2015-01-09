import re
from flask import *
from myapp.db_other import get_db,query_db,check_ext,img_resize
h=Blueprint('home',__name__)

@h.route('/')
def home():
	if 'count' in session:
		if int(session['count'])>0:
			g.cart=session['cart_addr']
			g.count=session['count']
			return render_template('home.html')
	return render_template('home.html' )
@h.route('/instant/',methods=['POST'])
def instant():
	j=request.get_json()
	srh=(re.sub('[ .,\-\@\_\&()]','',j['s'])).lower()
	r=query_db("select r_area,city from rest_user where r_search like %s",[str('%'+str(srh)+'%')])
	#r.execute("select email from r_users where email like '"+str('%'+str(j['s'])+'%')+"';")
	d={}
	inr=1
	for i in r:
		d[inr]=i[0]+','+i[1]
		inr=inr+1
	return jsonify(d)
@h.route('/searchresult/',methods=['get'])
def searchresult():
	if 'count' in session:
		if int(session['count'])>0:
			g.cart=session['cart_addr']
			g.count=session['count']
	quy=request.args.get('q')
	qr=quy
	if ',' in quy:
		frt=quy.rsplit(',',1)[0]
		lst=quy.rsplit(',',1)[1]
		quy=re.sub('[ .,\-\@\_\&()]','',str(quy)).lower()
		r=query_db("select name,r_area,city,r_image,r_id from rest_user where r_area=%s or r_search like %s",[str(frt),str('%'+str(quy)+'%')])
		if r:
			return render_template('searchresult.html',result=r,q=qr)
	else:
		quy=re.sub('[ .,\-\@\_\&()]','',str(quy)).lower()
		r=query_db("select name,r_area,city,r_image,r_id from rest_user where r_search like %s",[str('%'+str(quy)+'%')])
		if r:
			return render_template('searchresult.html',result=r,q=qr)
	return render_template('searchresult.html',result=r,q=qr)


@h.route('/restaurant/<city>/<rest_name>/<int:idi>/')
def restaurant(city=None,rest_name=None,idi=-1):
	if city and rest_name:
		#try:
			r=query_db('select p_id,p_name,p_type,p_price from products where r_id=%s',[idi])
			i=query_db('select name,r_area,city,r_image from rest_user where r_id=%s',[idi])
			rev=query_db('select name,re_text,image,tm from reviews where r_id=%s and status=%s',[idi,1])
			if rev:
				review=rev.fetchall()
			else:
				review=None
			session['cart_addr']='/restaurant/'+city+'/'+rest_name+'/'+str(idi)
			g.cart=session['cart_addr']
			if 'r_id' in session:
				if(int(session['r_id'])==int(idi)):
					g.count=session['count']
					return render_template('restaurant.html',r=r,ii=i,cart=session['cart'],total=session['total'],review=review)
				else:
					session['r_id']=int(idi)
			session['r_id']=int(idi)
			d={}
			session['cart']=d
			session['total']=0
			session['number']=0
			session['count']=0
			g.count=session['count']
			return render_template('restaurant.html',r=r,ii=i,total=session['total'],review=review)
			return redirect(url_for('h.home'))

@h.route('/logout/')
def logout():
	if 'user' in session:
		session.pop('user', None)
		session.pop('type', None)
	return redirect(url_for('home.home'))

# app/models/festival.py

from app import db

class Festival(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fclty_nm = db.Column(db.String(100))
    rdnmadr_nm = db.Column(db.String(200))
    fstvl_begin_de = db.Column(db.String(10))
    fstvl_end_de = db.Column(db.String(10))
    hmpg_addr = db.Column(db.String(200))
    mnnst_nm = db.Column(db.String(100))
    tel_no = db.Column(db.String(50))
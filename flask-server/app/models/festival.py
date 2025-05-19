from app import db

class Festival(db.Model):
    __tablename__ = "festivals"

    id = db.Column(db.Integer, primary_key=True)
    fclty_nm = db.Column(db.String(200), nullable=False)
    rdnmadr_nm = db.Column(db.String(200), nullable=False)
    fstvl_begin_de = db.Column(db.String(20), nullable=False)
    fstvl_end_de = db.Column(db.String(20), nullable=False)
    hmpg_addr = db.Column(db.String(300), nullable=True)
    mnnst_nm = db.Column(db.String(200), nullable=True)
    tel_no = db.Column(db.String(50), nullable=True)

    def __repr__(self):
        return f"<Festival {self.fclty_nm}>"

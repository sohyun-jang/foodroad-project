from app import db

class Festival(db.Model):
    __tablename__ = "festivals"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    event_lat = db.Column(db.Float, nullable=False)
    event_lng = db.Column(db.Float, nullable=False)
    url = db.Column(db.String(500))
    profitability = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "date": self.date,
            "location": self.location,
            "event_lat": self.event_lat,
            "event_lng": self.event_lng,
            "url": self.url,
            "profitability": self.profitability
        }
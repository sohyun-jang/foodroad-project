import pandas as pd
from app import create_app, db
from app.models.festival import Festival

app = create_app()

with app.app_context():
    df = pd.read_csv("data/최종_예측.csv")

    for _, row in df.iterrows():
        festival = Festival(
            id=row["id"],
            name=row["name"],
            date=row["date"],
            location=row["location"],
            event_lat=row["event-lat"],
            event_lng=row["event-lng"],
            url=row["URL"],
            profitability=row["profitability"]
        )
        db.session.merge(festival)  # 중복 방지
    db.session.commit()
    print("Festivals loaded successfully!")

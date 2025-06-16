from flask import Flask,request,jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
import mysql.connector as sql
import logging

app=Flask(__name__)
soc_io=SocketIO(app,cors_allowed_origins="*")
CORS(app)
def connect_db():
    return sql.connect(host="localhost", user="root", passwd="chai", database="hospital_management", autocommit=True)

logging.basicConfig(filename='hospital.log',level=logging.INFO)

#generating token
@app.route('/token_queue',methods=['GET'])
def token_queue():
    con=connect_db()
    cur=con.cursor(dictionary=True)
    cur.execute("select token_id,dept_id,patient_name,status from token_queue")
    token=cur.fetchall()
    con.close()
    return jsonify(token)

@app.route('/token',methods=['POST'])
def generate_token():
    con=connect_db()
    cur=con.cursor(dictionary=True)

    data=request.json
    q="insert into token_queue (dept_id,patient_name) values (%s, %s)"
    cur.execute(q,(data['dept_id'],data['patient_name']))
    con.commit()
    cur.execute("select token_id, dept_id,patient_name,status from token_queue where patient_name=%s order by token_id desc limit 1",(data['patient_name'],))
    new_token=cur.fetchone()
    
    if new_token:
        token_dict={"token_id":new_token[0],"dept_id":new_token[1],"patient_name":new_token[2],"status":new_token[3]}
        soc_io.emit("new_token_generated",token_dict)
    con.close()
    return jsonify({'message':'Generated token successfully!!','token':new_token})

@app.route('/get_departments', methods=['GET'])
def get_departments():
    con=connect_db()
    cur=con.cursor(dictionary=True)
    cur.execute("SELECT * FROM departments")
    departments = cur.fetchall()
    con.close()
    return jsonify({"departments":departments})


#displaying the stock of drugs
@app.route('/inventory',methods=['GET'])
def get_inventory():
    con=connect_db()
    cur=con.cursor(dictionary=True)
    cur.execute("select drug_name,drug_quantity,reorder_level,status from drug_inventory")
    drugs=cur.fetchall()
    con.close()
    return jsonify({"inventory":drugs})

#updating stock
@app.route('/update_stock', methods=['POST'])
def update_inventory():
    con = connect_db()
    cur = con.cursor(dictionary=True)

    data = request.json
    query = "UPDATE drug_inventory SET drug_quantity = %s WHERE drug_name = %s"
    cur.execute(query, (data["drug_quantity"], data["drug_name"]))
    con.commit()

    # Fetch reorder level
    q = "SELECT reorder_level FROM drug_inventory WHERE drug_name=%s"
    cur.execute(q, (data["drug_name"],))
    d = cur.fetchone()

    if d:
        reorder_level = d["reorder_level"]
        if data["drug_quantity"] == 0:
            status = "Out of Stock"
        elif data["drug_quantity"] <= reorder_level:
            status = "Low Stock"
        else:
            status = "Available"

        # Update status column correctly
        q1 = "UPDATE drug_inventory SET status = %s WHERE drug_name = %s"
        cur.execute(q1, (status, data["drug_name"]))
        con.commit()

    # Return updated inventory entry
    q2 = "SELECT drug_name, drug_quantity, reorder_level, status FROM drug_inventory WHERE drug_name=%s"
    cur.execute(q2, (data["drug_name"],))
    updated_data = cur.fetchone()

    con.close()
    return jsonify({"message": f"Updated stock for {data['drug_name']}!", "updated_inventory": updated_data})

@app.route('/check_token',methods=['GET'])
def get_token_pos():
    con=connect_db()
    cur=con.cursor(dictionary=True)
    patient_name = request.args.get('patient_name')
    q="select count(*) from token_queue where token_id <= (select token_id from token_queue where patient_name=%s)"
    cur.execute(q,(patient_name,))
    position=cur.fetchone()[0]
    con.close()
    return jsonify({'Message':f'Your position in queue:{position}'})


@app.route('/emergency_alert',methods=['POST'])
def emergency_alert():
    con=connect_db()
    cur=con.cursor(dictionary=True)
    data=request.json
    alert_type=data.get('alert_type')
    if alert_type not in ["Code Blue","Code Red"]:
        return jsonify({"Error":"Invalid alert type"}),400
    q="insert into emergency_alert (code_type,timestamp) values(%s,NOW())"
    cur.execute(q,(alert_type,))
    soc_io.emit('hospital_alert',{'message':f'{alert_type} Alert Activated!!'})
    con.close()
    return jsonify({'message':f'{alert_type} triggered successfully!!'})

@app.route('/get_emergency_alerts',methods=['GET'])
def get_emergency_alert():
    con=connect_db()
    cur=con.cursor(dictionary=True)
    cur.execute("select * from emergency_alert order by timestamp desc")
    alerts=cur.fetchall()
    cur.close()
    con.close()
    return jsonify(alerts)
@soc_io.on('connect')
def handle_connect():
    print("Client connected")

@soc_io.on('disconnect')
def handle_disconnect():
    print("Client disconnected")

if __name__=="__main__":
    soc_io.run(app,debug=True,port=5000)

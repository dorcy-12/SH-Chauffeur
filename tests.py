import ssl
import certifi
import xmlrpc.client
from datetime import datetime
dorcy, dorcypw = "h.dorcy@sh-personal.com", "amatama"
admin, adminpw = "default@localhost.localdomain", "%z1S5#t_Za"

#context = ssl.create_default_context(cafile=certifi.where())
#info = xmlrpc.client.ServerProxy('https://demo.odoo.com/start', context = context).start()
#url,db, username, password = info['host'], info['database'], info['user'], info['password']

url = "http://217.160.15.116"
db = "default_sx3p1odoo"
username = dorcy
password = dorcypw

common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(url))
uid = common.authenticate(db, username, password, {})
models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(url))

def get_all_employees():
    employees = models.execute_kw(
        db, uid, password,
        'hr.employee', 'search_read',
        [[]],  # Empty list for search domain to get all records
        {'fields': ['id', 'name']}  # Fields you want to fetch, such as 'id' and 'name'
    )

    for employee in employees:
        print(f"Employee ID: {employee['id']}, Name: {employee['name']}")
#
get_all_employees()

#models_list = models.execute_kw(
#    db, uid, password,
#    'ir.model', 'search_read',
#    [[]],
#   {'fields': ['model']}
#)

#for model in models_list:
#    print(model['model'])

# Search for installed apps

#service_records = models.execute_kw(
#    db, uid, password,
#   'fleet.vehicle.log.services', 'search_read',
#    [[]],
#    {'fields': ['service_type_id','vehicle_id', 'amount', 'date', 'purchaser_id','state']}  # Adjust the fields based on your needs
#)

#Printing details of each service record
#for record in service_records:
    #print(f"Service Type: {record['service_type_id']},Date: {record['date']}, Car: {record['vehicle_id']}, driver:{record['purchaser_id']}, state: {record['state']}")

def check_in():
    check_in_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    attendance_id = models.execute_kw(
        db, uid, password,
       'hr.attendance', 'create',
        [{'employee_id':employee_id, 'check_in': check_in_time}]
    )
    print(f"Checked in with ID: {attendance_id}")

employee_id = 4  # Replace with the actual employee ID
check_in()

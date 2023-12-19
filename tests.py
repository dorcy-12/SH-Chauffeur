import xmlrpc.client
from datetime import datetime
dorcy, dorcypw = "h.dorcy@sh-personal.com", "amatama"
admin, adminpw = "default@localhost.localdomain", "9N*Aj8#tW9"

url = "http://217.160.15.116"
db = "default_xnqp1odoo"
username = dorcy
password = dorcypw

common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(url))
uid = common.authenticate(db, username, password, {})
print(uid)
models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(url))

def get_all_employees():
    try:
        employees = models.execute_kw(
            db, uid, password,
            'hr.employee', 'search_read',
            [[]],  # Empty list for search domain to get all records
            {'fields': ['id', 'name']}  # Fields you want to fetch, such as 'id' and 'name'
        )

        for employee in employees:
            print(f"Employee ID: {employee['id']}, Name: {employee['name']}")
    except Exception as e:
        print(f"An error occurred: {e}")

#get_all_employees()

if uid:
    user_data = models.execute_kw(db, uid, password, 'res.users', 'read', [uid], {'fields': ['partner_id']})
    
    if user_data and user_data[0]:
        partner_id = user_data[0]['partner_id'][0]  # The first element is the ID
        print("Your partner ID is:", partner_id)
    else:
        print("User data not found.")
else:
    print("Authentication failed.")

def check_in():
    check_in_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    attendance_id = models.execute_kw(
        db, uid, password,
       'hr.attendance', 'create',
        [{'employee_id':employee_id, 'check_in': check_in_time}]
    )
    print(f"Checked in with ID: {attendance_id}")

employee_id = 4  # Replace with the actual employee ID


def upsert_firebase_token(partner_id, firebase_token, device_os):
    if uid:
        # Search for existing token for the partner
        existing_token_id = models.execute_kw(
            db, uid, password,
            'mail.firebase', 'search',
            [[['partner_id', '=', partner_id], ['os', '=', device_os]]]
        )

        if existing_token_id:
            # Update existing token
            response = models.execute_kw(
                        db, uid, password,
                        'mail.firebase', 'write',
                        [existing_token_id, {'token': firebase_token}]
                    )
            print(f"Token updated for partner ID:{partner_id} AND RESPONSE IS {response} ")
        else:
            # Create new token
            response = models.execute_kw(
                        db, uid, password,
                        'mail.firebase', 'create',
                        [{'partner_id': partner_id, 'token': firebase_token, 'os': device_os}]
                    )
            print(f"Token created for partner ID:{partner_id} amd response id {response}")
    else:
        print("Authentication Failed")

# Example usage
partner_id = 12  # Replace with the actual partner ID
firebase_token = 'ambatam'  # Replace with the actual Firebase token
device_os = 'Sionooo'  # Example device OS
#upsert_firebase_token(partner_id, firebase_token, device_os)
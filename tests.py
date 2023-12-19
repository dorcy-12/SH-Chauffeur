import xmlrpc.client
from datetime import datetime
dorcy, dorcypw = "h.dorcy@sh-personal.com", "amatama"
admin, adminpw = "default@localhost.localdomain", "9N*Aj8#tW9"

#context = ssl.create_default_context(cafile=certifi.where())
#info = xmlrpc.client.ServerProxy('https://demo.odoo.com/start', context = context).start()
#url,db, username, password = info['host'], info['database'], info['user'], info['password']

url = "http://217.160.15.116"
db = "default_xnqp1odoo"
username = dorcy
password = dorcypw

common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(url))
uid = common.authenticate(db, username, password, {})
print(uid)
models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(url))
print(uid)


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
#get_all_employees()

#models_list = models.execute_kw(
#    db, uid, password,
#    'ir.model', 'search_read',
#    [[]],
#   {'fields': ['model']}
#)

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
#

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
upsert_firebase_token(partner_id, firebase_token, device_os)

message_details = {
    'body': "Hello, this is a test message.",
    'subject': "Message Subject",
    'message_type': "comment",  # or "notification", depending on your need
    'partner_ids': [(4, 12)],  # partner_id to notify
    # Add other fields if necessary
}

# Send the message to a specific record
record_id = 12  # Example record ID of the 'res.partner' model

def sendMessage():

    message_id = models.execute_kw(
    db, uid, password,
    'mail.channel', 'message_post',
    [5],  # ID of the channel
    {
        'body': "Hi my friend, is everything okay in nenver land",
        'message_type': 'comment',
        'subtype_xmlid': 'mail.mt_comment',
        # Add other parameters if necessary
    })
    print(f"Message sent successfully with ID: {message_id}")


sendMessage()

def getpartners():
    responses = models.execute_kw(
        db, uid, password,
        "res.users", "search_read",
        [[]],  # List of IDs (in this case, just one)
        {'fields': ["partner_id"]}
    )
    for response in responses:
        print(response)
#getpartners()
def getchannels():
    responses = models.execute_kw(db, uid, password,
                                 'mail.channel', 'search_read',
                                 [[]],
                                 { 'fields': ['id','name', 'description', 'channel_type', 'public']})
    for response in responses:
        print(response)
#getchannels()
import xmlrpc.client
import base64
from datetime import datetime


#context = ssl.create_default_context(cafile=certifi.where())
#info = xmlrpc.client.ServerProxy('https://demo.odoo.com/start', context = context).start()
#url,db, username, password = info['host'], info['database'], info['user'], info['password']

url = "https://sh-odoo.com"
db = "default_xnqp1odoo"
#username = "default@localhost.localdomain"
#password = "9N*Aj8#tW9"
username = "h.dorcy@sh-personal.com"
password = "amatama"
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
        {'fields': [],'limit':1}  # Fields you want to fetch, such as 'id' and 'name'
    )

    for employee in employees:
        print(employee)
#
#get_all_employees()

#models_list = models.execute_kw(
#    db, uid, password,
#    'ir.model', 'search_read',
#    [[]],
#   {'fields': ['model']}
        
# 
{'id': 2, 'partner_id': [3, 'Administrator']}
{'id': 8, 'partner_id': [12, 'Dorcy Agape Hakizimana']}
{'id': 9, 'partner_id': [13, 'frank kukiki']}
"""

#get_all_employees()



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
device_os = 'androide'  # Example device OS
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
                                 [[('id','=', 5)]],
                                 { 'fields': []})
    for response in responses:
        print(response)
#getchannels()

def sendMessage(msg, id):
    response = models.execute_kw(db, uid, password,
                'mail.channel', 'message_post',
                [id],  # list of one ID
                {'body': msg, 'message_type': 'comment', 'subtype_xmlid': 'mail.mt_comment'})
    print(f"Message sent to channel ID {id} with responose {response}")

#sendMessage("hi bro are you doing well?", 5)

def getMessages(id):
    messages =  models.execute_kw(db, uid, password,
                'mail.message', 'search_read',
                [[('res_id', '=', id),("model", "=", "mail.channel")]],  # Filter for the specific channel
                {'limit':1})  # Fields you want to retrieve

    # Print the retrieved messages
    print(messages)

#getMessages(5)

def downloadAttachment(attachment_id):
    attachment = models.execute_kw(db, uid, password,
                'ir.attachment', 'read',
                [attachment_id], {'fields': ['name', 'datas', 'mimetype']})
    print(attachment)

    #Check if attachment is found and has data
    if attachment and attachment[0].get('datas'):
        # Decode the base64 encoded data
        data = base64.b64decode(attachment[0]['datas'])

        # Write to a file
        with open(attachment[0]['name'], 'wb') as file:
            file.write(data)

        print(f"Attachment {attachment[0]['name']} downloaded successfully.")
    else:
        print("Attachment not found or no data available.")

#downloadAttachment(749)

def sendAttachment(channel_id):
    try:
        with open("./assets/test.png", 'rb') as file:
            file_content = base64.b64encode(file.read())
    except:
        print("error")

    
    # Create an attachment
    attachment_id = models.execute_kw(db, uid, password,
        'ir.attachment', 'create',
        [{'name': 'Attachment Name',  # Give a suitable name
        'datas': file_content.decode(),  # Encoded file content
        'res_model': 'mail.channel',
        'res_id': channel_id}])
    
    

    #Send a message with the attachment
    message = "Your message with attachment"  # Your message text
    models.execute_kw(db, uid, password,
        'mail.channel', 'message_post',
        [channel_id],
        {'body': message,
        'message_type': 'comment',
        'subtype_xmlid': 'mail.mt_comment',
        'attachment_ids': [767]})  # Linking the attachment """

    print(f"Message sent with attachment ID {767}")

#sendAttachment(5)
def getVehicleIds():
    vehicle_details = models.execute_kw(db, uid, password, 'fleet.vehicle', 'search_read', [[]], {'fields': ["id", "name", "description","license_plate"]})
    return vehicle_details

def getServiceTypeDetails():
    service_type_details = models.execute_kw(db, uid, password, 'fleet.vehicle.log.services', 'search_read', [[]], {'fields': ['id','purchaser_id','state']})
    return service_type_details


def createService():
    service_id = models.execute_kw(db, uid, password, 'fleet.vehicle.log.services', 'create', [{
    'date': '2024-01-01 15:32:22',
    'vehicle_id': 1, 
    'description':'helloo',
    'purchaser_id': 3,
    'service_type_id': 2
    
    }])
    return service_id

vehicle_ids = getServiceTypeDetails()  # Call the function to get vehicle IDs
for vehicle in vehicle_ids:
    print("Vehicle IDs:", vehicle)


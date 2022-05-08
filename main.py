#Klient
pins.touch_set_mode(TouchTarget.P1, TouchTargetMode.CAPACITIVE)
pins.touch_set_mode(TouchTarget.P2, TouchTargetMode.CAPACITIVE)
radio.set_group(69)
radio.set_transmit_power(7)
radio.set_transmit_serial_number(True)

state = 0
cislo = 65
char = String.from_char_code(cislo)
num = char.char_code_at(0)
value = Math.constrain(cislo, 65, 68)
my_serial_number = control.device_serial_number()
server_serial_numeber = 123 # !!! NUTNÉ ZMĚNIT NA SÉRIOVÉ ČÍSLO SERVERU !!!
muzu_hlasovat = True
print(my_serial_number)

def on_button_pressed_a():
    if muzu_hlasovat == True:
        radio.send_value("vote", 1)
        basic.show_string(String.from_char_code(cislo))

def on_logo_event_pressed():
    if muzu_hlasovat == True:
        radio.send_value("vote", 2)
        basic.show_string(String.from_char_code(cislo+1))

def on_button_pressed_b():
    if muzu_hlasovat == True:
        radio.send_value("vote", 3)
        basic.show_string(String.from_char_code(cislo+2))

def on_pin_pressed_p2():
    if muzu_hlasovat == True:
        radio.send_value("vote", 4)
        basic.show_string(String.from_char_code(cislo+3))

def on_pin_pressed_p1():
    if state == 0:
        state = 1
        basic.show_icon(IconNames.HAPPY)
    else:
        state = 0
        basic.show_icon(IconNames.SAD)
    radio.send_value("key", state)

def on_received_value(name, value):
    serial_number = radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)
    global state, muzu_hlasovat
    if name == "key":
        state = value
        print(state)
    if state == 1 and name == "key":
        music.play_tone(Note.C, music.beat())
    if serial_number == server_serial_numeber:
        if name == "success" and value == int(str(my_serial_number) + "0"):
            basic.show_icon(IconNames.SAD)
        if name == "success" and value == int(str(my_serial_number) + "1"):
            basic.show_icon(IconNames.HAPPY)
        if name == "toggle" and value == 1:
            muzu_hlasovat = True
        if name == "toggle" and value == 0:
            muzu_hlasovat = False
            basic.show_icon(IconNames.NO)


input.on_button_pressed(Button.A, on_button_pressed_a)
input.on_logo_event(TouchButtonEvent.PRESSED, on_logo_event_pressed)
input.on_button_pressed(Button.B, on_button_pressed_b)
input.on_pin_pressed(TouchPin.P2, on_pin_pressed_p2)
input.on_pin_pressed(TouchPin.P1, on_pin_pressed_p1)
radio.on_received_value(on_received_value)
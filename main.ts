// Klient
pins.touchSetMode(TouchTarget.P1, TouchTargetMode.Capacitive)
pins.touchSetMode(TouchTarget.P2, TouchTargetMode.Capacitive)
radio.setGroup(69)
radio.setTransmitPower(7)
radio.setTransmitSerialNumber(true)
let state = 0
let cislo = 65
let char = String.fromCharCode(cislo)
let num = char.charCodeAt(0)
let value = Math.constrain(cislo, 65, 68)
let my_serial_number = control.deviceSerialNumber()
let server_serial_numeber = 123
//  !!! NUTNÉ ZMĚNIT NA SÉRIOVÉ ČÍSLO SERVERU !!!
let muzu_hlasovat = true
console.log(my_serial_number)
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    if (muzu_hlasovat == true) {
        radio.sendValue("vote", 1)
        basic.showString(String.fromCharCode(cislo))
    }
    
})
input.onLogoEvent(TouchButtonEvent.Pressed, function on_logo_event_pressed() {
    if (muzu_hlasovat == true) {
        radio.sendValue("vote", 2)
        basic.showString(String.fromCharCode(cislo + 1))
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    if (muzu_hlasovat == true) {
        radio.sendValue("vote", 3)
        basic.showString(String.fromCharCode(cislo + 2))
    }
    
})
input.onPinPressed(TouchPin.P2, function on_pin_pressed_p2() {
    if (muzu_hlasovat == true) {
        radio.sendValue("vote", 4)
        basic.showString(String.fromCharCode(cislo + 3))
    }
    
})
input.onPinPressed(TouchPin.P1, function on_pin_pressed_p1() {
    let state: number;
    if (state == 0) {
        state = 1
        basic.showIcon(IconNames.Happy)
    } else {
        state = 0
        basic.showIcon(IconNames.Sad)
    }
    
    radio.sendValue("key", state)
})
radio.onReceivedValue(function on_received_value(name: string, value: number) {
    let serial_number = radio.receivedPacket(RadioPacketProperty.SerialNumber)
    
    if (name == "key") {
        state = value
        console.log(state)
    }
    
    if (state == 1 && name == "key") {
        music.playTone(Note.C, music.beat())
    }
    
    if (serial_number == server_serial_numeber) {
        if (name == "success" && value == parseInt("" + my_serial_number + "0")) {
            basic.showIcon(IconNames.Sad)
        }
        
        if (name == "success" && value == parseInt("" + my_serial_number + "1")) {
            basic.showIcon(IconNames.Happy)
        }
        
        if (name == "toggle" && value == 1) {
            muzu_hlasovat = true
        }
        
        if (name == "toggle" && value == 0) {
            muzu_hlasovat = false
            basic.showIcon(IconNames.No)
        }
        
    }
    
})

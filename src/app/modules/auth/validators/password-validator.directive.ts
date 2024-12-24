import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export const passwordValidator: ValidatorFn = (
    control: AbstractControl
): ValidationErrors | null => {
    const value = control.value
    if (!value) {
        return null
    }

    const hasUpperCase = /[A-Z]/.test(value)
    const hasNumeric = /[0-9]/.test(value)
    const hasMinLength = value.length >= 6

    const passwordValid = hasUpperCase && hasNumeric && hasMinLength

    return !passwordValid ? { passwordStrength: true } : null
}

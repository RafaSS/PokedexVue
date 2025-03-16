import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'

const TEMP_USER_ID_KEY = 'pokodex_temp_user_id'
const COOKIE_CONSENT_KEY = 'pokodex_cookie_consent'
const COOKIE_EXPIRY_DAYS = 30

export const cookieService = {
  /**
   * Gets or creates a temporary user ID
   */
  getTempUserId(): string {
    let tempUserId = Cookies.get(TEMP_USER_ID_KEY)

    if (!tempUserId) {
      tempUserId = uuidv4()
      this.setTempUserId(tempUserId)
    }

    return tempUserId
  },

  /**
   * Sets the temporary user ID cookie
   */
  setTempUserId(userId: string): void {
    Cookies.set(TEMP_USER_ID_KEY, userId, {
      expires: COOKIE_EXPIRY_DAYS,
      sameSite: 'strict',
    })
  },

  /**
   * Checks if the user has given cookie consent
   */
  hasCookieConsent(): boolean {
    return Cookies.get(COOKIE_CONSENT_KEY) === 'true'
  },

  /**
   * Sets the cookie consent
   */
  setCookieConsent(consent: boolean): void {
    Cookies.set(COOKIE_CONSENT_KEY, consent.toString(), {
      expires: COOKIE_EXPIRY_DAYS,
      sameSite: 'strict',
    })
  },

  /**
   * Clears the temporary user ID cookie
   */
  clearTempUserId(): void {
    Cookies.remove(TEMP_USER_ID_KEY)
  },
}

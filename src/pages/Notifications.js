import React, { useState, useEffect } from 'react'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'

import Navigation from '../components/Navigation'
import LoadingIndicator from '../modules/LoadingIndicator'
import axios from 'axios'
import { apiURL } from '../config.json'

const Notifications = () => {
  const userId = localStorage.getItem('id')

  const [notifications, setNotifications] = useState([])

  const { promiseInProgress } = usePromiseTracker()

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
          userStoryNotifications (where: {
            users: {
              id: "${userId}"
            }
          }){
            message
            id
            users {
              id
            }
            seenBy {
              id
            }
            date
          }
        }`
        },
        {
          withCredentials: true
        }
      )
      setNotifications(response.data.data.userStoryNotifications)
    }
    trackPromise(fetchNotifications())
  }, [userId])

  return (
    <>
      <div className='base-wrapper'>
        <div className='base-container'>
          <Navigation />
          {promiseInProgress ? (
            <LoadingIndicator />
          ) : (
            <div className='notifications'>
              <h3>Notifications</h3>
              <div className='flex flex-column'>
                {notifications ? (
                  notifications.map((ele, key) => {
                    return (
                      <div className='notification' key={key}>
                        <div className='notification-text'>{ele.message}</div>
                        <div className='notification-text'>
                          {`${ele.date.slice(0, 10)}  ${ele.date.slice(
                            11,
                            19
                          )}`}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className='notification'>
                    <div className='notification-text'>
                      No notifications at the moment
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Notifications

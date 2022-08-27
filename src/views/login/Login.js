import React from 'react';
import {Button, Checkbox, Form, Input, message} from 'antd';
import { 
  LockOutlined, 
  UserOutlined } from '@ant-design/icons';

import './Login.css';
import Particles from 'react-particles';
import { loadFull } from "tsparticles";
import { useCallback } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Login(props) {

  const navigate = useNavigate()

  const onFinish = (values) => {
    console.log('Received values of form: ', values);

    axios.get(`http://localhost:8000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res=>{
      console.log(res.data)

      if(res.data.length===0){
        message.error("密码错误或与用户名不匹配")
      }else{
        localStorage.setItem("token",JSON.stringify(res.data[0]))
        navigate("/")
      }
    })
  };

  //Particle
  const particlesInit = useCallback(async (engine) => {
    console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

  return (
    <div style={{
      background:'rgb(35, 39, 65)',
      height:'100%'
    }}>
      <Particles id="tsparticles" options={{
        "autoPlay": true,
        "background": {
          "color": {
            "value": "#ffffff"
          },
          "image": "url('https://particles.js.org/images/background3.jpg')",
          "position": "50% 50%",
          "repeat": "no-repeat",
          "size": "cover",
          "opacity": 1
        },
        "backgroundMask": {
          "composite": "destination-out",
          "cover": {
            "color": {
              "value": {
                "r": 255,
                "g": 255,
                "b": 255
              }
            },
            "opacity": 1
          },
          "enable": true
        },
        "fullScreen": {
          "enable": true,
          "zIndex": 1
        },
        "detectRetina": true,
        "duration": 0,
        "fpsLimit": 120,
        "interactivity": {
          "detectsOn": "window",
          "events": {
            "onClick": {
              "enable": true,
              "mode": "push"
            },
            "onDiv": {
              "selectors": [],
              "enable": false,
              "mode": [],
              "type": "circle"
            },
            "onHover": {
              "enable": true,
              "mode": "bubble",
              "parallax": {
                "enable": false,
                "force": 60,
                "smooth": 10
              }
            },
            "resize": true
          },
          "modes": {
            "attract": {
              "distance": 200,
              "duration": 0.4,
              "easing": "ease-out-quad",
              "factor": 1,
              "maxSpeed": 50,
              "speed": 1
            },
            "bounce": {
              "distance": 200
            },
            "bubble": {
              "distance": 400,
              "duration": 2,
              "mix": false,
              "opacity": 1,
              "size": 100,
              "divs": {
                "distance": 200,
                "duration": 0.4,
                "mix": false,
                "selectors": []
              }
            },
            "connect": {
              "distance": 80,
              "links": {
                "opacity": 0.5
              },
              "radius": 60
            },
            "grab": {
              "distance": 400,
              "links": {
                "blink": false,
                "consent": false,
                "opacity": 1
              }
            },
            "light": {
              "area": {
                "gradient": {
                  "start": {
                    "value": "#ffffff"
                  },
                  "stop": {
                    "value": "#000000"
                  }
                },
                "radius": 1000
              },
              "shadow": {
                "color": {
                  "value": "#000000"
                },
                "length": 2000
              }
            },
            "push": {
              "default": true,
              "groups": [],
              "quantity": 4
            },
            "remove": {
              "quantity": 2
            },
            "repulse": {
              "distance": 200,
              "duration": 0.4,
              "factor": 100,
              "speed": 1,
              "maxSpeed": 50,
              "easing": "ease-out-quad",
              "divs": {
                "distance": 200,
                "duration": 0.4,
                "factor": 100,
                "speed": 1,
                "maxSpeed": 50,
                "easing": "ease-out-quad",
                "selectors": []
              }
            },
            "slow": {
              "factor": 3,
              "radius": 200
            },
            "trail": {
              "delay": 1,
              "pauseOnStop": false,
              "quantity": 1
            }
          }
        },
        "manualParticles": [],
        "motion": {
          "disable": false,
          "reduce": {
            "factor": 4,
            "value": true
          }
        },
        "particles": {
          "bounce": {
            "horizontal": {
              "random": {
                "enable": false,
                "minimumValue": 0.1
              },
              "value": 1
            },
            "vertical": {
              "random": {
                "enable": false,
                "minimumValue": 0.1
              },
              "value": 1
            }
          },
          "collisions": {
            "bounce": {
              "horizontal": {
                "random": {
                  "enable": false,
                  "minimumValue": 0.1
                },
                "value": 1
              },
              "vertical": {
                "random": {
                  "enable": false,
                  "minimumValue": 0.1
                },
                "value": 1
              }
            },
            "enable": false,
            "mode": "bounce",
            "overlap": {
              "enable": true,
              "retries": 0
            }
          },
          "color": {
            "value": "#ffffff",
            "animation": {
              "h": {
                "count": 0,
                "enable": false,
                "offset": 0,
                "speed": 1,
                "decay": 0,
                "sync": true
              },
              "s": {
                "count": 0,
                "enable": false,
                "offset": 0,
                "speed": 1,
                "decay": 0,
                "sync": true
              },
              "l": {
                "count": 0,
                "enable": false,
                "offset": 0,
                "speed": 1,
                "decay": 0,
                "sync": true
              }
            }
          },
          "destroy": {
            "mode": "none",
            "split": {
              "count": 1,
              "factor": {
                "random": {
                  "enable": false,
                  "minimumValue": 0
                },
                "value": 3
              },
              "rate": {
                "random": {
                  "enable": false,
                  "minimumValue": 0
                },
                "value": {
                  "min": 4,
                  "max": 9
                }
              },
              "sizeOffset": true
            }
          },
          "gradient": [],
          "groups": {},
          "links": {
            "blink": false,
            "color": {
              "value": "#ffffff"
            },
            "consent": false,
            "distance": 150,
            "enable": true,
            "frequency": 1,
            "opacity": 1,
            "shadow": {
              "blur": 5,
              "color": {
                "value": "#000"
              },
              "enable": false
            },
            "triangles": {
              "enable": false,
              "frequency": 1
            },
            "width": 1,
            "warp": false
          },
          "move": {
            "angle": {
              "offset": 0,
              "value": 90
            },
            "attract": {
              "distance": 200,
              "enable": false,
              "rotate": {
                "x": 600,
                "y": 1200
              }
            },
            "center": {
              "x": 50,
              "y": 50,
              "radius": 0
            },
            "decay": 0,
            "distance": {},
            "direction": "none",
            "drift": 0,
            "enable": true,
            "gravity": {
              "acceleration": 9.81,
              "enable": false,
              "inverse": false,
              "maxSpeed": 50
            },
            "path": {
              "clamp": true,
              "delay": {
                "random": {
                  "enable": false,
                  "minimumValue": 0
                },
                "value": 0
              },
              "enable": false,
              "options": {}
            },
            "outModes": {
              "default": "out",
              "bottom": "out",
              "left": "out",
              "right": "out",
              "top": "out"
            },
            "random": false,
            "size": false,
            "speed": 2,
            "spin": {
              "acceleration": 0,
              "enable": false
            },
            "straight": false,
            "trail": {
              "enable": false,
              "length": 10,
              "fillColor": {
                "value": "#000000"
              }
            },
            "vibrate": false,
            "warp": false
          },
          "number": {
            "density": {
              "enable": true,
              "area": 800,
              "factor": 1000
            },
            "limit": 0,
            "value": 80
          },
          "opacity": {
            "random": {
              "enable": false,
              "minimumValue": 0.1
            },
            "value": 1,
            "animation": {
              "count": 0,
              "enable": false,
              "speed": 1,
              "decay": 0,
              "sync": false,
              "destroy": "none",
              "startValue": "random",
              "minimumValue": 0.1
            }
          },
          "reduceDuplicates": false,
          "repulse": {
            "random": {
              "enable": false,
              "minimumValue": 0
            },
            "value": 0,
            "enabled": false,
            "distance": 1,
            "duration": 1,
            "factor": 1,
            "speed": 1
          },
          "rotate": {
            "random": {
              "enable": false,
              "minimumValue": 0
            },
            "value": 0,
            "animation": {
              "enable": false,
              "speed": 0,
              "decay": 0,
              "sync": false
            },
            "direction": "clockwise",
            "path": false
          },
          "shadow": {
            "blur": 0,
            "color": {
              "value": "#000"
            },
            "enable": false,
            "offset": {
              "x": 0,
              "y": 0
            }
          },
          "shape": {
            "options": {},
            "type": "circle"
          },
          "size": {
            "random": {
              "enable": true,
              "minimumValue": 1
            },
            "value": {
              "min": 1,
              "max": 30
            },
            "animation": {
              "count": 0,
              "enable": false,
              "speed": 40,
              "decay": 0,
              "sync": false,
              "destroy": "none",
              "startValue": "random",
              "minimumValue": 0.1
            }
          },
          "stroke": {
            "width": 0
          },
          "zIndex": {
            "random": {
              "enable": false,
              "minimumValue": 0
            },
            "value": 0,
            "opacityRate": 1,
            "sizeRate": 1,
            "velocityRate": 1
          }
        },
        "pauseOnBlur": true,
        "pauseOnOutsideViewport": true,
        "responsive": [],
        "style": {},
        "themes": [],
        "zLayers": 100
      }} init={particlesInit} loaded={particlesLoaded}></Particles>
      <div className='formContainer'>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox style={{color:'white'}}>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            <div style={{color:'white', float:'left'}}>Or <a href="">register now!</a></div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

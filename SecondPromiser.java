/*
 * ColoredPromiser.java
 *
 * Created on 2004년 11월 30일 (화), 오전 7:23
 */

/**
 *
 * @author  Gibatte
 */
import java.awt.Color;
public class SecondPromiser extends FirstPromiser{
        
        float askingRatio=0.1f;
        public SecondPromiser(float x, float y, float speed, boolean isStatic) {
                super(x,y,speed,isStatic);

        }
        public Color getColor()
        {
                if(size==0)return Color.LIGHT_GRAY;
                else if(size==1)return Color.green;
                else if(size==2)return Color.cyan;
                else if(size==3)return Color.red;
                else if(size==4)return Color.orange;
                else
                        return Color.yellow;
                
                
        }
        
        Object tm=null;
        public void act()
        {
                if(isStatic){}//do nothing
                else{
                        if(currentTarget instanceof Promiser)
                        {
                                Promiser myTarget=(Promiser) currentTarget;


                                //move toward target
                                float dx=(myTarget).x-x;
                                float dy=(myTarget).y-y;
                                float distance= (float)Math.sqrt(dy*dy+dx*dx);
                                //if promise is kept execute start promise.
                                if(distance<hitDistance)
                                {
                                        size--;//get one off
                                        
                                        if(Math.random()<askingRatio)
                                        {
                                                if(currentTarget instanceof FirstPromiser)
                                                {
                                                	while (tm!=currentTarget)
                                                		tm=myPromises[(int)(Math.random()*numPromises)];
                                                      //
                                                    	  ((SecondPromiser)(currentTarget)).addPromise((Promiser)tm);
                                                }
                                        }
                                        
                                        //if theres no more promises stay in place
                                        if(size<=0)
                                        {

                                                currentTarget=null;
                                        }
                                        else
                                        {
                                                

                                                currentTarget=myPromises[size-1];
                                                
                                        }
                                }
                                if(distance!=0){
                                float ratio= speed/distance;                        
                                lastX=x;
                                lastY=y;
                                x+=dx*ratio;
                                y+=dy*ratio;
                                }



                        }
                }
        }
        
}

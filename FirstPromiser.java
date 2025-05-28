public class FirstPromiser extends Promiser{
        /*
        public double x=1;
        public double y=1;
        public double lastX=1;
        public double lastY=1;
        
        public double speed=0.2;
        public Object currentTarget=null;
         */
        
        /** Creates a new instance of Promiser */
        public boolean isStatic;
        
        int hitDistance=0;
        int numPromises=100;
        Promiser[] myPromises= new Promiser[numPromises];
        int size=0;
        public FirstPromiser(float x, float y, float speed,boolean isStatic) {
                super(x,y,speed);
                hitDistance=(int)speed;
                this.isStatic=isStatic;
        }
        public void addPromise(Promiser target)
        {
                //if 5 or more promises is there some will be lost
                if(size>=numPromises)
                {
                        myPromises[(int)(Math.random()*numPromises)]=target;
                        currentTarget=myPromises[numPromises-1];
                }
                else 
                {
                        myPromises[size]=target;
                        size++;
                        currentTarget=target;
                }
        }

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

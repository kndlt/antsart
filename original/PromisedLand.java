
import java.awt.*;
import java.awt.image.*;
import java.awt.event.*;

public class PromisedLand extends javax.swing.JApplet implements KeyListener, MouseListener, ActionListener, Runnable, MouseMotionListener, MouseWheelListener{
        /*
		 * 
		 */
		boolean isPainting=true;
		//public float opq =.5f;
		boolean limitPaint=false;
		int paintLimit=100;
		private static final long serialVersionUID = 1L;
		int mouseLastX=-1;
        int mouseLastY=-1;
        double zoom=1;
        
        boolean spacepressed=false;

        
        Graphics pen=null;
        /////////////////////////////////
        int numPromisers=10000;
        int expansionPixel=5000;
        float firstRatio=0.92f;
        int speed=3;
        Color defaultColor=Color.yellow;
        
        //////////////////////////////////
        int halfsize=6;
        int width=1024;
        int height=768;
        BufferedImage pad=new BufferedImage(width,height,BufferedImage.TYPE_INT_RGB);
        
        int centerX=(int)(expansionPixel/2);
        int centerY=(int)(expansionPixel/2);

        boolean paused=false;
        boolean dragged=false;
        
        //VIEW OPTION
        boolean lineView=true;
        
        boolean rescreen=true;
        
        boolean ovalView=false;

        Thread mainThread=null;
        
        Promiser[] myPromisers=new Promiser[numPromisers];
        /** Creates a new instance of PromisedLand */
        public PromisedLand() {
                setBackground(Color.BLACK);
                super.addMouseListener(this);
                super.addKeyListener(this);
                super.addMouseWheelListener(this);
                super.addMouseMotionListener(this);

                //add(lineViewCheck);
                //add(ovalViewCheck);
                //add(rescreenCheck);
                System.out.println("1: start/pause              2: lineView on/off                3: OvalView On/Off           \n" +
                "4: Rescreen on/off");
                
                
                //makeSimpleFollowers();
                //makeFirstPromisers(50);
                makeSecondPromisers(5);
                pen=pad.getGraphics();

                
        }
        
        public void makeSecondPromisers(int numOfPromises)
        {
                for(int i=0; i<numPromisers;i++)
                {
                        if(Math.random()<firstRatio)
                                myPromisers[i]=new SecondPromiser((float)Math.random()*expansionPixel,(float)Math.random()*expansionPixel,speed,false);//mover
                        else
                                myPromisers[i]=new SecondPromiser((float)Math.random()*expansionPixel,(float)Math.random()*expansionPixel,speed,true);//statics
                }
                //set Targets
                for(int i=0; i<numPromisers;i++)
                {
                        //add promises
                        for(int j=0;j<numOfPromises;j++){
                                ((SecondPromiser)(myPromisers[i])).addPromise(myPromisers[(int)(Math.random()*numPromisers)]);
                        }
                        
                }
        }
        public void makeFirstPromisers(int numOfPromises)
        {
                for(int i=0; i<numPromisers;i++)
                {
                        if(Math.random()<firstRatio)
                                myPromisers[i]=new FirstPromiser((float)(Math.random()*expansionPixel),(float)(Math.random()*expansionPixel),speed,false);//mover
                        else
                                myPromisers[i]=new FirstPromiser((float)(Math.random()*expansionPixel),(float)(Math.random()*expansionPixel),speed,true);//statics
                }
                //set Targets
                for(int i=0; i<numPromisers;i++)
                {
                        //add promises
                        for(int j=0;j<numOfPromises;j++){
                                ((FirstPromiser)(myPromisers[i])).addPromise(myPromisers[(int)(Math.random()*numPromisers)]);
                        }
                        
                }
        }
        public void makeSimpleFollowers()
        {
                for(int i=0; i<numPromisers;i++)
                {
                        myPromisers[i]=new SimpleFollowers((float)Math.random()*expansionPixel,(float)Math.random()*expansionPixel,speed);
                }
                //set Targets
                for(int i=0; i<numPromisers;i++)
                {
                        myPromisers[i].currentTarget=myPromisers[(int)(Math.random()*numPromisers)];
                }
        }
        public int fix(float num)
        {
                return (int)(num*zoom);
        }
        public int fixX(float x)
        {
                return ((int)((x-centerX+width/2)*zoom));
        }
        public int fixY(float y)
        {
        	return ((int)((y-centerY+height/2)*zoom));
        }
        public void paint(Graphics g)
        {

        	
                pen.setColor(defaultColor);
                //rescrean
                if(rescreen&&!spacepressed)
                {
                	//pen.clearRect(0,0, 2000,1200);  
                	//pen.setColor(new Color(0f,0f,0f));
                	pen.clearRect(0,0, width,height);
                }

                pen.setColor(defaultColor);
                if(dragged){pen.clearRect(0,0, width,height);  dragged=false;
                }            
                
                int tempx,tempy,tempw,temph;
                
                //g.drawLine(1,2, 50,(int)(Math.random()*100));
                int limit=numPromisers;
                if(limitPaint&& paintLimit<=numPromisers){
                	limit=paintLimit;
                }
                if(lineView){
                        for(int i=0; i<limit;i++)
                        {
                                tempx=fixX(myPromisers[i].x);
                                tempy=fixY(myPromisers[i].y);
                                tempw=fixX(myPromisers[i].lastX);
                                temph=fixY(myPromisers[i].lastY);
                                if(myPromisers[i] instanceof SecondPromiser)
                                	pen.setColor(((SecondPromiser)myPromisers[i]).getColor());
                                pen.drawLine(tempx,tempy,tempw,temph);
                                
                        }
                }
                if(ovalView){
                        for(int i=0; i<limit;i++)
                        {
                                if(myPromisers[i] instanceof FirstPromiser && ((FirstPromiser)myPromisers[i]).isStatic) pen.setColor(Color.DARK_GRAY);
                                else pen.setColor(defaultColor);
                                pen.drawOval(fixX(myPromisers[i].x-halfsize),fixY(myPromisers[i].y-halfsize),2*halfsize,2*halfsize);
                        }
                }
                //pen.setColor(Color.CYAN);
                //pen.clearRect(5, 5, 50, 20);
                //pen.drawString("Scale: "+zoom+" X",10,10);
                
        		

        	g.drawImage(pad,0,0,null);
        }
        

        
        public void mouseClicked(MouseEvent e) {
               
                
        }

        public void mouseEntered(MouseEvent e) {
        }

        public void mouseExited(MouseEvent e) {
        }

        public void mousePressed(MouseEvent e) {
                

        }

        public void mouseReleased(MouseEvent e) {
                mouseLastX=-1;
                mouseLastY=-1;

                paused=false;
        }

        
        public void actionPerformed(ActionEvent e) {
        }
        public void start() {
                if (mainThread == null) {
                        mainThread = new Thread(this, "Clock");
                        mainThread.start();
                }
        }


        public void run() {

                Thread myThread = Thread.currentThread();
                while (mainThread == myThread) {

                        //act
                        if((!paused)&&(!spacepressed)){
                                for(int i=0; i<numPromisers;i++)
                                {
                                        myPromisers[i].act();
                                }
                        }
                        //repaint
                        if(isPainting)
                        	repaint();
                        try {
                                Thread.sleep(0);
                        } catch (InterruptedException e){
                }
               
        }

        }
        public void stop() {
                mainThread = null;
        }

        public void mouseDragged(MouseEvent e) {
                //get current
                int currX=e.getX();
                int currY=e.getY();
                //if its not first time
                if(mouseLastX!=-1 &&mouseLastY!=-1)
                {
                        centerX+=(mouseLastX-currX)/zoom;
                        centerY+=(mouseLastY-currY)/zoom;
                        dragged=true;
                        paused=true;
                        repaint();
                }
                mouseLastX=currX;
                mouseLastY=currY;
                
                
        }
        
        public void mouseMoved(MouseEvent e) {//System.out.println("Moved");
        }
        
        public void mouseWheelMoved(MouseWheelEvent e) {
                
                int units=e.getWheelRotation();
                if(units>0)//backward
                {
                        zoom*=.9;
                }
                else
                {
                        zoom*=1.1;
                }
                
        }
        
        public void keyPressed(KeyEvent e) { 
        }
        
        public void keyReleased(KeyEvent e) {
                if(e.getKeyCode()==e.VK_SPACE)//1
                {
                  spacepressed=!spacepressed;

                }
                else if(e.getKeyCode()==50)//2
                {lineView=!lineView;}
                else if(e.getKeyCode()==51)//3
                {ovalView=!ovalView;}                
                else if(e.getKeyCode()==52)//4
                {rescreen=!rescreen;}
                else if(e.getKeyCode()==53)//
                {halfsize++;}
                else if(e.getKeyCode()==54)//
                {halfsize--;}       
                else if(e.getKeyCode()==KeyEvent.VK_H)//
                {limitPaint=!limitPaint;}       

 


                
                
        }
        
        public void keyTyped(KeyEvent e) {   
                

        }
        
}
